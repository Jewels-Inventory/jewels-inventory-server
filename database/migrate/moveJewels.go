package migrate

import (
	"go.mongodb.org/mongo-driver/bson"
	"jewels/database"
)

type OwnerWithDevices struct {
	Devices []database.Device `bson:"devices"`
	Id      string            `bson:"_id"`
	Email   string            `bson:"email"`
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
			device.OwnerId = owner.Id
			_, err = jewelsCollection.InsertOne(ctx, device)
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
