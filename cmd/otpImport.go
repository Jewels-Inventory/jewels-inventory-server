package cmd

import (
	_import "jewels/import"
	"log/slog"

	"github.com/spf13/cobra"
)

func GetImportOtpCmd() *cobra.Command {
	var userId int64
	var otpFile string
	cmd := &cobra.Command{
		Use:   "import-otp",
		Short: "Import otp codes",
		Run: func(cmd *cobra.Command, args []string) {
			slog.Info("Import otp codes")
			err := _import.ImportOtp(otpFile, userId)
			if err != nil {
				slog.Error("Failed to import otp codes", "error", err)
			} else {
				slog.Info("Import done successfully")
			}
		},
	}

	cmd.Flags().Int64Var(&userId, "user-id", 0, "The users id")
	cmd.Flags().StringVar(&otpFile, "file", "", "The file to import")

	return cmd
}
