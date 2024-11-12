package api

import (
	"encoding/json"
	"jewels/database"
	"net/http"
)

func getOwners(w http.ResponseWriter, r *http.Request) {
	encoder := json.NewEncoder(w)

	devices, err := database.FindAllOwners()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	encoder.Encode(devices)
}
