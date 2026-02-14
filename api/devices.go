package api

import (
	"encoding/json"
	"jewels/database"
	eol2 "jewels/eol"
	"log/slog"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

func downloadAndUpdateDeviceEol(device database.Device) {
	eol, err := eol2.GetEolForDevice(&device)
	if err != nil {
		slog.Info("No eol found for device", "device", device.Model, "error", err)
		return
	}

	slog.Info("Eol found for device", "device", device.Model, "eol", eol)
	err = database.UpdateJewelEol(device.OwnerId, device.Id, eol)
	if err != nil {
		slog.Error("Error updating device eol", "device", device.Model, "error", err)
	}
}

func getDevices(w http.ResponseWriter, r *http.Request) {
	encoder := json.NewEncoder(w)
	vars := mux.Vars(r)

	ownerId, err := strconv.Atoi(vars["ownerId"])
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}

	devices, err := database.FindJewels(int64(ownerId))
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	encoder.Encode(devices)
}

func deleteDevice(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	ownerId, err := strconv.Atoi(vars["ownerId"])
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}

	deviceId := vars["deviceId"]

	err = database.DeleteJewel(int64(ownerId), deviceId)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func createDevice(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	ownerId, err := strconv.Atoi(vars["ownerId"])
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}

	decoder := json.NewDecoder(r.Body)
	var body struct {
		Device database.Device `json:"jewel,omitempty"`
		Mode   string          `json:"mode"`
		Token  string          `json:"token,omitempty"`
	}
	err = decoder.Decode(&body)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}

	if body.Mode == "manual" {
		device, err := database.CreateJewel(int64(ownerId), &body.Device)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}

		downloadAndUpdateDeviceEol(*device)

		encoder := json.NewEncoder(w)
		w.WriteHeader(http.StatusCreated)
		encoder.Encode(device)
	} else if body.Mode == "auto" {
		err = database.CreateToken(int64(ownerId), body.Token)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}
	}
}

func updateDevice(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	decoder := json.NewDecoder(r.Body)
	var body database.Device

	err := decoder.Decode(&body)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}

	deviceId := vars["deviceId"]

	ownerId, err := strconv.Atoi(vars["ownerId"])
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}

	body.DeviceId = deviceId

	err = database.UpdateJewel(int64(ownerId), &body)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	jewel, err := database.FindJewelByOwnerAndDeviceId(int64(ownerId), body.DeviceId)
	if err == nil && jewel != nil {
		downloadAndUpdateDeviceEol(*jewel)
	}

	w.WriteHeader(http.StatusNoContent)
}

func pushDeviceData(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	decoder := json.NewDecoder(r.Body)
	var body database.Device

	err := decoder.Decode(&body)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}

	body.Type = database.DeviceType(vars["type"])
	err = database.CreateOrUpdateJewel(getUserFromRequest(r).Id, &body)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	jewel, err := database.FindJewelByOwnerAndDeviceId(getUserFromRequest(r).Id, body.DeviceId)
	if err == nil && jewel != nil {
		downloadAndUpdateDeviceEol(*jewel)
	}

	w.WriteHeader(http.StatusNoContent)
}
