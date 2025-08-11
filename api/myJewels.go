package api

import (
	"encoding/json"
	"jewels/database"
	"jewels/relay"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

func getMyJewels(w http.ResponseWriter, r *http.Request) {
	encoder := json.NewEncoder(w)

	devices, err := database.FindJewels(getUserFromRequest(r).Id)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	encoder.Encode(devices)
}

func deleteMyJewel(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	jewelId := vars["jewel"]

	err := database.DeleteJewel(getUserFromRequest(r).Id, jewelId)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	w.WriteHeader(http.StatusNoContent)
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
		device, err := database.CreateJewel(getUserFromRequest(r).Id, &body.Device)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}

		encoder := json.NewEncoder(w)
		w.WriteHeader(http.StatusCreated)
		encoder.Encode(device)
	} else if body.Mode == "auto" {
		err = database.CreateToken(getUserFromRequest(r).Id, body.Token)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}

		w.WriteHeader(http.StatusNoContent)
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

	jewelId, err := strconv.Atoi(vars["jewel"])
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}
	body.Id = int64(jewelId)

	err = database.UpdateJewel(getUserFromRequest(r).Id, &body)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func getVpnConfig(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	owner := getUserFromRequest(r)
	deviceId := vars["deviceId"]
	device, err := database.FindJewelByOwnerAndDeviceId(owner.Id, deviceId)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	config, err := relay.GetRelayClientConfig(device)
	if err != nil || config == nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusOK)
	_, _ = w.Write(config)
}
