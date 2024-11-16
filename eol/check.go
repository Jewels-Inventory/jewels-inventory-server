package eol

import (
	"jewels/database"
	"jewels/mailing"
	"log"
)

func CheckEol() {
	devices, err := database.FindNextMonthEolDevices()
	if err != nil {
		log.Printf("ERROR: Failed to find next month eol devices %v", err)
		return
	}

	for _, device := range devices {
		owner, err := database.FindOwnerById(device.OwnerId)
		if err != nil {
			log.Printf("ERROR: Failed to find owner by owner id %s: %v", device.OwnerId, err)
			continue
		}

		if err := mailing.SendEolMail(device, *owner); err != nil {
			log.Printf("ERROR: Failed to send eol mail: %v", err)
			continue
		}
	}
}
