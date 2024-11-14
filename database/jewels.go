package database

import (
	"errors"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var ErrNotSameOwner = errors.New("device has different owner")

func FindJewels(owner string) ([]Device, error) {
	client, err := OpenConnection()
	if err != nil {
		return nil, err
	}

	defer CloseConnection(client)

	ctx, cancelFunc := GetContext()
	defer cancelFunc()

	deviceCollection := GetDevicesCollection(client)
	cursor, err := deviceCollection.Find(ctx, bson.M{"ownerId": owner})
	if err != nil {
		return nil, err
	}

	var devices []Device
	err = cursor.All(ctx, &devices)
	if err != nil {
		return nil, err
	}

	return devices, nil
}

func FindJewelById(id string) (*Device, error) {
	client, err := OpenConnection()
	if err != nil {
		return nil, err
	}

	defer CloseConnection(client)

	ctx, cancelFunc := GetContext()
	defer cancelFunc()

	deviceCollection := GetDevicesCollection(client)
	result := deviceCollection.FindOne(ctx, bson.M{"_id": id})
	if result.Err() != nil {
		return nil, err
	}

	device := new(Device)
	err = result.Decode(device)
	if err != nil {
		return nil, err
	}

	return device, nil
}

func DeleteJewel(owner, jewel string) error {
	client, err := OpenConnection()
	if err != nil {
		return err
	}

	defer CloseConnection(client)

	ctx, cancelFunc := GetContext()
	defer cancelFunc()

	deviceCollection := GetDevicesCollection(client)
	_, err = deviceCollection.DeleteOne(ctx, bson.M{"ownerId": owner, "_id": jewel})

	return err
}

func CreateJewel(owner string, device Device) (*Device, error) {
	client, err := OpenConnection()
	if err != nil {
		return nil, err
	}

	defer CloseConnection(client)

	ctx, cancelFunc := GetContext()
	defer cancelFunc()

	deviceCollection := GetDevicesCollection(client)
	if device.Id == "" {
		device.Id = uuid.New().String()
	}

	device.OwnerId = owner
	_, err = deviceCollection.InsertOne(ctx, device)

	return &device, err
}

func CreateToken(owner, token string) error {
	client, err := OpenConnection()
	if err != nil {
		return err
	}

	defer CloseConnection(client)

	ctx, cancelFunc := GetContext()
	defer cancelFunc()

	ownerCollection := GetOwnersCollection(client)
	_, err = ownerCollection.UpdateOne(ctx, bson.M{"_id": owner}, bson.M{"$push": bson.M{"tokens": token}})

	return err
}

func UpdateJewel(owner string, device Device) error {
	client, err := OpenConnection()
	if err != nil {
		return err
	}

	defer CloseConnection(client)

	ctx, cancelFunc := GetContext()
	defer cancelFunc()

	deviceCollection := GetDevicesCollection(client)
	if device.Id == "" {
		device.Id = uuid.New().String()
	}

	if checkJewelOwnerById(owner, device.Id) {
		return ErrNotSameOwner
	}

	device.OwnerId = owner

	_, err = deviceCollection.UpdateOne(ctx, bson.M{"_id": device.Id, "ownerId": device.OwnerId}, bson.M{"$set": device})

	return err
}

func CreateOrUpdateJewel(owner string, device Device) error {
	jewel, err := FindJewelById(device.Id)
	if (err != nil && errors.Is(err, mongo.ErrNoDocuments)) || jewel == nil {
		_, err = CreateJewel(owner, device)
		return err
	} else if err != nil {
		return err
	}

	if jewel.OwnerId != owner {
		return ErrNotSameOwner
	}

	return UpdateJewel(owner, device)
}

func checkJewelOwnerById(ownerId, deviceId string) bool {
	client, err := OpenConnection()
	if err != nil {
		return false
	}

	defer CloseConnection(client)

	ctx, cancelFunc := GetContext()
	defer cancelFunc()

	deviceCollection := GetDevicesCollection(client)
	count, err := deviceCollection.CountDocuments(ctx, bson.M{"ownerId": ownerId, "_id": deviceId}, options.Count().SetLimit(1))

	return count > 0 && err != nil
}
