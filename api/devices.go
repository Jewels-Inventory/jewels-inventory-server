package api

import (
	"encoding/json"
	"github.com/gorilla/mux"
	"jewels/database"
	"log"
	"net/http"
	"strings"
	"time"
)

func downloadAndUpdateDeviceEol(device database.Device) {
	if strings.ToLower(device.Manufacturer) == "samsung" && device.Type != database.Computer && device.Type != database.Other {
		res, err := http.Get("https://endoflife.date/api/samsung-mobile.json")
		if err != nil {
			return
		}

		type responseDevice struct {
			Cycle string `json:"cycle"`
			Eol   any    `json:"eol"`
		}

		decoder := json.NewDecoder(res.Body)
		var devices []responseDevice
		err = decoder.Decode(&devices)
		if err != nil {
			return
		}

		for _, d := range devices {
			if strings.ToLower(d.Cycle) == strings.ToLower(device.Model) {
				eolString, ok := d.Eol.(string)
				if ok {
					eol, err := time.Parse("2006-01-02", eolString)
					if err != nil {
						return
					}

					device.Eol = &eol
					err = database.UpdateJewel(device.OwnerId, device)
					if err != nil {
						log.Println(err)
						return
					}
				}
			}
		}
	}
}

func getDevices(w http.ResponseWriter, r *http.Request) {
	encoder := json.NewEncoder(w)
	vars := mux.Vars(r)

	devices, err := database.FindJewels(vars["ownerId"])
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	encoder.Encode(devices)
}

func deleteDevice(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	err := database.DeleteJewel(vars["ownerId"], vars["deviceId"])
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}
}

func createDevice(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
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
		device, err := database.CreateJewel(vars["ownerId"], body.Device)
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
		err = database.CreateToken(vars["ownerId"], body.Token)
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

	body.Id = vars["deviceId"]

	err = database.UpdateJewel(vars["ownerId"], body)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	jewel, err := database.FindJewelById(body.Id)
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
	err = database.CreateOrUpdateJewel(GetUserFromRequest(r).Id, body)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	jewel, err := database.FindJewelById(body.Id)
	if err == nil && jewel != nil {
		downloadAndUpdateDeviceEol(*jewel)
	}

	w.WriteHeader(http.StatusNoContent)
}
