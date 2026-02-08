package api

import (
	"encoding/json"
	"jewels/database"
	"net/http"
)

func getIcons(w http.ResponseWriter, r *http.Request) {
	encoder := json.NewEncoder(w)

	icons, err := database.GetIcons()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	encoder.Encode(icons)
}
