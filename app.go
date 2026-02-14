package main

import (
	"embed"
	"fmt"
	"jewels/cmd"
	"jewels/config"
	"jewels/database"
	"jewels/encryption"
	"jewels/logging"
	"log/slog"
	"os"

	"github.com/spf13/cobra"

	_ "github.com/joho/godotenv/autoload"
)

var (
	//go:embed openapi
	openapi embed.FS
	//go:embed static
	static embed.FS
)

var rootCmd = &cobra.Command{
	Use:   "jewels",
	Short: "Jewels is a small family targeted inventory system",
}

func init() {
	rootCmd.AddCommand(cmd.GetServeCmd(openapi, static))
	rootCmd.AddCommand(cmd.GetImportOtpCmd())
}

func main() {
	logging.SetupLogging()
	slog.Info("Prepared logging")

	encryption.SetupEncryption()
	slog.Info("Loading configuration")
	err := config.LoadConfiguration()
	if err != nil {
		panic(err)
	}

	slog.Info("Preparing the database")
	database.SetupDatabase()

	defer database.GetDbMap().Db.Close()

	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}
