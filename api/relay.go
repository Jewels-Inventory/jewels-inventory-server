package api

import (
	"encoding/json"
	"github.com/gorilla/mux"
	"jewels/database"
	"jewels/relay"
	"net/http"
)

func getRelayClients(w http.ResponseWriter, r *http.Request) {
	encoder := json.NewEncoder(w)
	clients, err := relay.GetAllRelayClients()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	_ = encoder.Encode(clients)
}

func getAllDevices(w http.ResponseWriter, r *http.Request) {
	encoder := json.NewEncoder(w)
	jewels, err := database.FindAllJewels()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	type deviceWithRelay struct {
		Id            string         `json:"id"`
		Hostname      *string        `json:"hostname,omitempty"`
		Manufacturer  string         `json:"manufacturer"`
		Model         string         `json:"model"`
		Type          string         `json:"type"`
		RelayServerId *int64         `json:"relayServerId"`
		RelayClientId *int64         `json:"relayClientId"`
		Owner         database.Owner `json:"owner"`
	}

	devices := make([]deviceWithRelay, len(jewels))
	for i, jewel := range jewels {
		owner, err := database.FindOwnerById(jewel.OwnerId)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}

		devices[i] = deviceWithRelay{
			Id:            jewel.DeviceId,
			Hostname:      jewel.Hostname,
			Manufacturer:  jewel.Manufacturer,
			Model:         jewel.Model,
			Type:          string(jewel.Type),
			Owner:         *owner,
			RelayClientId: jewel.RelayClientId,
			RelayServerId: jewel.RelayServerId,
		}
	}

	_ = encoder.Encode(devices)
}

func setRelayConfig(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	deviceId := vars["deviceId"]
	device, err := database.FindJewelByDeviceId(deviceId)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	decoder := json.NewDecoder(r.Body)
	var body struct {
		RelayServerId int64 `json:"relayServerId"`
		RelayClientId int64 `json:"relayClientId"`
	}

	err = decoder.Decode(&body)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}

	device.RelayServerId = &body.RelayServerId
	device.RelayClientId = &body.RelayClientId

	err = database.UpdateJewel(device.OwnerId, device)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func getRelayConfig(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	deviceId := vars["deviceId"]
	device, err := database.FindJewelByDeviceId(deviceId)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	if device.RelayServerId == nil || device.RelayClientId == nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	config, err := relay.GetRelayClientConfig(device)
	if err != nil || config == nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	_, _ = w.Write(config)
}
