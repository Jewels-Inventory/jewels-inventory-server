package api

import (
	"fmt"
	"jewels/database"
	"jewels/icons"
	"net/http"

	"github.com/gorilla/mux"
)

func getBrandIcon(w http.ResponseWriter, r *http.Request) error {
	vars := mux.Vars(r)
	brand := vars["brand"]
	icon, err := database.GetBrandIcon(brand)
	if err != nil {
		return err
	}

	data, err := icons.FetchAndCacheBrandIcon(icon)
	if err != nil {
		return err
	}

	w.Header().Set("Content-Type", "image/webp")
	w.Header().Set("Cache-Control", "max-age=604800")
	w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=%s.webp", icon.Name))
	w.Header().Set("Content-Transfer-Encoding", "binary")
	w.Header().Set("Content-Length", fmt.Sprintf("%d", len(data)))
	_, err = w.Write(data)

	return err
}

func getSimpleIcon(w http.ResponseWriter, r *http.Request) error {
	vars := mux.Vars(r)
	brand := vars["brand"]
	icon, err := database.GetSimpleIcon(brand)
	if err != nil {
		return err
	}

	data, err := icons.FetchAndCacheSimpleIcon(icon)
	if err != nil {
		return err
	}

	w.Header().Set("Content-Type", "image/svg+xml")
	w.Header().Set("Cache-Control", "max-age=604800")
	w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=%s.svg", icon.Title))
	w.Header().Set("Content-Transfer-Encoding", "binary")
	_, err = w.Write(data)

	return err
}

func getIcon(w http.ResponseWriter, r *http.Request) {
	err := getBrandIcon(w, r)
	if err == nil {
		return
	}

	err = getSimpleIcon(w, r)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte(err.Error()))
		return
	}
}
