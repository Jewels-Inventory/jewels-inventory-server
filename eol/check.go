package eol

import (
	"jewels/database"
	"jewels/mailing"
	"log/slog"
)

func CheckEol() {
	devices, err := database.FindNextMonthEolDevices()
	if err != nil {
		slog.Error("Failed to find next month eol devices", "error", err)
		return
	}

	for _, device := range devices {
		owner, err := database.FindOwnerById(device.OwnerId)
		if err != nil {
			slog.Error("Failed to find owner by owner id", "ownerId", device.OwnerId, "error", err)
			continue
		}

		if err := mailing.SendEolMail(device, *owner); err != nil {
			slog.Error("Failed to send eol mail", "error", err)
			continue
		}
	}
}
