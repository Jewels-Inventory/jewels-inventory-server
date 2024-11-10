package api

import (
	"encoding/json"
	"github.com/gorilla/mux"
	"jewels/database"
	"net/http"
)

func getMyJewels(w http.ResponseWriter, r *http.Request) {
	encoder := json.NewEncoder(w)

	devices, err := database.GetJewelsByUser(GetUserFromRequest(r).Email)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	encoder.Encode(devices)
}

func deleteMyJewel(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	err := database.DeleteJewel(GetUserFromRequest(r).Email, vars["jewel"])
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}
}

func createMyJewel(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var body struct {
		Device database.Device `json:"jewel,omitempty"`
		Mode   string          `json:"mode"`
		Token  string          `json:"token,omitempty"`
	}
	err := decoder.Decode(&body)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}

	if body.Mode == "manual" {
		device, err := database.CreateJewel(GetUserFromRequest(r).Email, body.Device)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}

		encoder := json.NewEncoder(w)
		w.WriteHeader(http.StatusCreated)
		encoder.Encode(device)
	} else if body.Mode == "auto" {
		err = database.CreateToken(GetUserFromRequest(r).Email, body.Token)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}
	}
}

func updateMyJewel(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	decoder := json.NewDecoder(r.Body)
	var body database.Device

	err := decoder.Decode(&body)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}

	body.Id = vars["jewel"]

	err = database.UpdateJewel(GetUserFromRequest(r).Email, body)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
