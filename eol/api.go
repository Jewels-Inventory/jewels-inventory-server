package eol

import (
	"encoding/json"
	"fmt"
	"jewels/database"
	"log/slog"
	"net/http"
	"strings"
	"time"
)

type deviceInformation struct {
	Result struct {
		Name        string  `json:"name"`
		Label       string  `json:"label"`
		ReleaseDate string  `json:"releaseDate"`
		IsEoas      bool    `json:"isEoas"`
		EoasFrom    *string `json:"eoasFrom"`
		IsEol       bool    `json:"isEol"`
		EolFrom     *string `json:"eolFrom"`
	} `json:"result"`
}

func getDeviceInformation(name, deviceType string) (*deviceInformation, error) {
	res, err := http.Get(fmt.Sprintf("https://endoflife.date/api/v1/products/%s/releases/%s", deviceType, name))
	if err != nil {
		return nil, err
	}

	defer res.Body.Close()
	decoder := json.NewDecoder(res.Body)

	var result deviceInformation

	err = decoder.Decode(&result)
	if err != nil {
		return nil, err
	}

	return &result, nil
}

func getPossibleDeviceTypes(device *database.Device) []string {
	// At the moment only different samsung phones, tablets and watches are supported
	if strings.ToLower(device.Manufacturer) != "samsung" && !(device.Type == database.PhoneOrTablet || device.Type == database.Smartwatch) {
		return []string{}
	}

	if device.Type == database.PhoneOrTablet {
		if strings.Contains(strings.ToLower(device.Model), "tab") {
			return []string{"samsung-galaxy-tab", "samsung-mobile"}
		}

		return []string{"samsung-mobile"}
	}

	return []string{"samsung-galaxy-watch", "samsung-mobile"}
}

func getPossibleDeviceNames(device *database.Device) []string {
	nameWithDashes := strings.ToLower(strings.ReplaceAll(device.Model, " ", "-"))
	cleansedName := strings.ReplaceAll(strings.ReplaceAll(nameWithDashes, "(", ""), ")", "")
	nameWithoutSuffix := strings.TrimSuffix(nameWithDashes, "-5g")

	return []string{cleansedName, nameWithoutSuffix}
}

func GetEolForDevice(device *database.Device) (time.Time, error) {
	possibleDeviceTypes := getPossibleDeviceTypes(device)
	if len(possibleDeviceTypes) == 0 {
		return time.Time{}, fmt.Errorf("no possible device types found for device %s", device.Model)
	}

	possibleNames := getPossibleDeviceNames(device)
	if len(possibleNames) == 0 {
		return time.Time{}, fmt.Errorf("no possible device names found for device %s", device.Model)
	}

	var deviceMatrix []struct {
		Name string
		Type string
	}
	for _, possibleDeviceType := range possibleDeviceTypes {
		for _, possibleName := range possibleNames {
			deviceMatrix = append(deviceMatrix, struct {
				Name string
				Type string
			}{
				Name: possibleName,
				Type: possibleDeviceType,
			})
		}
	}

	for _, deviceInfo := range deviceMatrix {
		slog.Debug("Looking for device information", "type", deviceInfo.Type, "name", deviceInfo.Name)
		info, err := getDeviceInformation(deviceInfo.Name, deviceInfo.Type)
		if err != nil {
			continue
		}

		if info.Result.EolFrom != nil {
			return time.Parse("2006-01-02", *info.Result.EolFrom)
		}

		if info.Result.EoasFrom != nil {
			return time.Parse("2006-01-02", *info.Result.EoasFrom)
		}
	}

	return time.Time{}, fmt.Errorf("no eol or eoas data found for device %s", device.Model)
}
