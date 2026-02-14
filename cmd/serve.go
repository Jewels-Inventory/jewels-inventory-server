package cmd

import (
	"embed"
	"jewels/api"
	"jewels/web"
	"log/slog"
	"net/http"
	"os"
	"path"
	"strings"

	"github.com/gorilla/mux"
	"github.com/spf13/cobra"
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

func GetServeCmd(openapi, static embed.FS) *cobra.Command {
	return &cobra.Command{
		Use:   "serve",
		Short: "Serves the web app of Jewels",
		Run: func(cmd *cobra.Command, args []string) {
			slog.Info("Starting server")
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

			slog.Info("Serving at localhost:8090...")
			err := http.ListenAndServe(":8090", router)
			if err != nil {
				panic(err)
			}
		},
	}
}
