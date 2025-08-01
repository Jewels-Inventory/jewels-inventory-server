package main

import (
	"embed"
	"fmt"
	"github.com/gorilla/mux"
	"github.com/spf13/cobra"
	"jewels/api"
	"jewels/config"
	"jewels/database"
	"jewels/database/mongo"
	"jewels/eol"
	"jewels/web"
	"log"
	"net/http"
	"os"
	"path"
	"strings"

	_ "github.com/joho/godotenv/autoload"
)

type SpaHandler struct {
	embedFS      embed.FS
	indexPath    string
	fsPrefixPath string
}

func (handler SpaHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	fullPath := strings.TrimPrefix(path.Join(handler.fsPrefixPath, r.URL.Path), "/")
	file, err := handler.embedFS.Open(fullPath)
	if err != nil {
		http.ServeFileFS(w, r, handler.embedFS, handler.indexPath)
		return
	}

	if fi, err := file.Stat(); err != nil || fi.IsDir() {
		http.ServeFileFS(w, r, handler.embedFS, handler.indexPath)
		return
	}

	http.ServeFileFS(w, r, handler.embedFS, fullPath)
}

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

var serveCmd = &cobra.Command{
	Use:   "serve",
	Short: "Serves the web app of Jewels",
	Run: func(cmd *cobra.Command, args []string) {
		router := mux.NewRouter()

		api.SetupApiRouter(router)
		web.SetupWebRouter(router)

		if os.Getenv("ENV") == "dev" {
			router.PathPrefix("/static/").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				w.Header().Set("Service-Worker-Allowed", "/")
				http.FileServerFS(os.DirFS(".")).ServeHTTP(w, r)
			})
		} else {
			router.PathPrefix("/static/").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				w.Header().Set("Service-Worker-Allowed", "/")
				http.FileServerFS(static).ServeHTTP(w, r)
			})
		}

		router.PathPrefix("/openapi").Handler(SpaHandler{
			embedFS:      openapi,
			indexPath:    "openapi/index.html",
			fsPrefixPath: "",
		})

		log.Println("Serving at localhost:8090...")
		err := http.ListenAndServe(":8090", router)
		if err != nil {
			panic(err)
		}
	},
}

var checkEolCmd = &cobra.Command{
	Use:   "check-eol",
	Short: "Checks all known devices for eol",
	Run: func(cmd *cobra.Command, args []string) {
		eol.CheckEol()
	},
}

var (
	importFromMongoMongoUrl string
	importFromMongoDatabase string
)

var importFromMongo = &cobra.Command{
	Use:       "import-from-mongo",
	Short:     "Imports all owners and their devices from a mongo database",
	ValidArgs: []string{"mongo-url", "database"},
	Run: func(cmd *cobra.Command, args []string) {
		mongo.ImportFromMongoDb(importFromMongoMongoUrl, importFromMongoDatabase)
	},
}

func init() {
	importFromMongo.Flags().StringVarP(&importFromMongoMongoUrl, "mongo-url", "c", "", "The connection string to the mongo database")
	importFromMongo.Flags().StringVarP(&importFromMongoDatabase, "database", "d", "", "The name of the database to import from")

	rootCmd.AddCommand(serveCmd)
	rootCmd.AddCommand(checkEolCmd)
	rootCmd.AddCommand(importFromMongo)
}

func main() {
	log.Println("Loading configuration")
	err := config.LoadConfiguration()
	if err != nil {
		panic(err)
	}

	log.Println("Preparing the database")
	database.SetupDatabase()

	defer database.GetDbMap().Db.Close()

	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}
