package main

import (
	"embed"
	"github.com/gorilla/mux"
	"html/template"
	"jewels/api"
	"jewels/config"
	"jewels/database/migrate"
	"log"
	"net/http"
	"path"
	"strings"
)

var (
	//go:embed "frontend/dist/frontend/browser"
	frontend embed.FS
	//go:embed openapi
	openapi embed.FS
	//go:embed static
	static embed.FS
)

type SpaHandler struct {
	embedFS      embed.FS
	indexPath    string
	fsPrefixPath string
	templated    bool
	templateData any
}

func (handler SpaHandler) serveTemplated(w http.ResponseWriter, _ *http.Request) {
	tmpl, err := template.ParseFS(handler.embedFS, handler.indexPath)
	if err != nil {
		http.Error(w, "Failed to get admin page", http.StatusInternalServerError)
		return
	}

	err = tmpl.Execute(w, handler.templateData)
	if err != nil {
		http.Error(w, "Failed to get admin page", http.StatusInternalServerError)
		return
	}
}

func (handler SpaHandler) servePlain(w http.ResponseWriter, r *http.Request) {
	http.ServeFileFS(w, r, handler.embedFS, handler.indexPath)
}

func (handler SpaHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	fullPath := strings.TrimPrefix(path.Join(handler.fsPrefixPath, r.URL.Path), "/")
	file, err := handler.embedFS.Open(fullPath)
	if err != nil {
		if handler.templated {
			handler.serveTemplated(w, r)
		} else {
			handler.servePlain(w, r)
		}
		return
	}

	if fi, err := file.Stat(); err != nil || fi.IsDir() {
		if handler.templated {
			handler.serveTemplated(w, r)
		} else {
			handler.servePlain(w, r)
		}
		return
	}

	http.ServeFileFS(w, r, handler.embedFS, fullPath)
}

func main() {
	err := config.LoadConfiguration()
	if err != nil {
		panic(err)
	}

	migrate.DevicesToCollection()
	migrate.CleanSessions()
	migrate.RemoveOidcId()
	migrate.CreateUniqueForJewels()

	router := mux.NewRouter()

	api.SetupApiRouter(router)

	router.PathPrefix("/static/").Handler(http.FileServerFS(static))
	router.PathPrefix("/openapi").Handler(SpaHandler{
		embedFS:      openapi,
		indexPath:    "openapi/index.html",
		fsPrefixPath: "",
		templated:    false,
	})
	router.PathPrefix("/").Handler(SpaHandler{
		embedFS:      frontend,
		indexPath:    "frontend/dist/frontend/browser/index.html",
		fsPrefixPath: "frontend/dist/frontend/browser",
		templated:    true,
		templateData: config.LoadedConfiguration,
	})

	log.Println("Serving at localhost:8090...")
	err = http.ListenAndServe(":8090", router)
	if err != nil {
		panic(err)
	}
}
