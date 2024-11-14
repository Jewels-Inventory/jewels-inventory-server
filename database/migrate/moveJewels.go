package migrate

import (
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"jewels/database"
	"time"
)

type OwnerDevice struct {
	Id           *string                   `json:"id"`
	Type         database.DeviceType       `json:"type"`
	Hostname     *string                   `json:"hostname,omitempty"`
	Model        string                    `json:"model"`
	Manufacturer string                    `json:"manufacturer"`
	Os           *database.OperatingSystem `json:"os,omitempty"`
	Storage      *float64                  `json:"storage,omitempty"`
	Ram          *float64                  `json:"ram,omitempty"`
	Eol          *time.Time                `json:"eol,omitempty"`
	Cpu          *database.Cpu             `json:"cpu,omitempty"`
	Bios         *database.Bios            `json:"bios,omitempty"`
	Mainboard    *database.Mainboard       `json:"mainboard,omitempty"`
	Kernel       *database.Kernel          `json:"kernel,omitempty"`
	Drives       []database.Drive          `json:"drives,omitempty"`
}

type OwnerWithDevices struct {
	Devices []OwnerDevice `bson:"devices"`
	Id      string        `bson:"_id"`
	Email   string        `bson:"email"`
}

func DevicesToCollection() {
	client, err := database.OpenConnection()
	if err != nil {
		panic(err)
	}

	ctx, cancelFunc := database.GetContext()
	defer cancelFunc()

	defer database.CloseConnection(client)

	ownersCollection := database.GetOwnersCollection(client)
	jewelsCollection := database.GetDevicesCollection(client)

	cursor, err := ownersCollection.Find(ctx, bson.D{})
	if err != nil {
		panic(err)
	}

	var owners = make([]OwnerWithDevices, 0)
	err = cursor.All(ctx, &owners)
	if err != nil {
		panic(err)
	}

	for _, owner := range owners {
		for _, device := range owner.Devices {
			deviceId := uuid.New().String()
			if device.Id != nil {
				deviceId = *device.Id
			}

			newDevice := database.Device{
				Id:           deviceId,
				OwnerId:      owner.Id,
				Type:         device.Type,
				Hostname:     device.Hostname,
				Model:        device.Model,
				Manufacturer: device.Manufacturer,
				Os:           device.Os,
				Storage:      device.Storage,
				Ram:          device.Ram,
				Eol:          device.Eol,
				Cpu:          device.Cpu,
				Bios:         device.Bios,
				Mainboard:    device.Mainboard,
				Kernel:       device.Kernel,
				Drives:       device.Drives,
				Notes:        "",
			}

			_, err = jewelsCollection.InsertOne(ctx, newDevice)
			if err != nil {
				panic(err)
			}
		}

		owner.Devices = nil
		_, err := ownersCollection.UpdateOne(ctx, bson.M{"email": owner.Email}, bson.M{"$unset": bson.M{"devices": ""}})
		if err != nil {
			panic(err)
		}
	}
}
