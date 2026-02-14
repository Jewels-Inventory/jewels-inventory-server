package jobs

import (
	"jewels/database"
	"log/slog"
)

type UpdateAndroidDevicesList struct{}

func (UpdateAndroidDevicesList) Run() {
	slog.Info("Replacing android devices list")
	err := database.ReplaceAndroidDevices()
	if err != nil {
		slog.Error("Failed to replace android devices", "error", err)
	} else {
		slog.Info("Finished replacing android devices list")
	}
}
