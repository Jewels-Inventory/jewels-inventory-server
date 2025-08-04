package relay

import (
	"encoding/json"
	"fmt"
	"io"
	"jewels/config"
	"jewels/database"
	"net/http"
)

var ErrNoRelayClient = fmt.Errorf("device has no relay client")

func getRelayApiRequest(url string) (*http.Request, error) {
	req, err := http.NewRequest(http.MethodGet, fmt.Sprintf("%s/%s", config.LoadedConfiguration.RelayVpnServer, url), nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", config.LoadedConfiguration.RelayVpnServerAccessToken))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")

	return req, nil
}

func GetAllRelayClients() ([]database.RelayClient, error) {
	req, err := getRelayApiRequest("/api/management/server")
	if err != nil {
		return nil, err
	}

	type relayServer struct {
		Id int64 `json:"id"`
	}

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}

	if res.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("failed to fetch relay servers: %s", res.Status)
	}

	var relayServers []relayServer
	decoder := json.NewDecoder(res.Body)
	err = decoder.Decode(&relayServers)

	if err != nil {
		return nil, err
	}

	clients := make([]database.RelayClient, 0)
	for _, relayServer := range relayServers {
		req, err := getRelayApiRequest(fmt.Sprintf("api/management/server/%d/client", relayServer.Id))
		if err != nil {
			return nil, err
		}

		res, err := http.DefaultClient.Do(req)
		if err != nil {
			return nil, err
		}

		if res.StatusCode != http.StatusOK {
			return nil, fmt.Errorf("failed to fetch relay clients: %s", res.Status)
		}

		var relayClients []database.RelayClient
		decoder := json.NewDecoder(res.Body)
		err = decoder.Decode(&relayClients)

		if err != nil {
			return nil, err
		}

		clients = append(clients, relayClients...)
	}

	return clients, nil
}

func GetRelayClientConfig(device *database.Device) ([]byte, error) {
	if device.RelayClientId == nil || device.RelayServerId == nil {
		return nil, ErrNoRelayClient
	}

	req, err := getRelayApiRequest(fmt.Sprintf("api/management/server/%d/client/%d/config", *device.RelayServerId, *device.RelayClientId))
	if err != nil {
		return nil, err
	}

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}

	if res.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("failed to fetch relay client config: %s", res.Status)
	}

	conf, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}

	return conf, nil
}
