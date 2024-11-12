package database

import (
	"errors"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var ErrNotSameOwner = errors.New("device has different owner")

func FindMyJewels(email string) ([]Device, error) {
	client, err := OpenConnection()
	if err != nil {
		return nil, err
	}

	defer CloseConnection(client)

	ctx, cancelFunc := GetContext()
	defer cancelFunc()

	deviceCollection := GetDevicesCollection(client)
	owner, err := FindOwnerByEmail(email)
	if err != nil {
		return nil, err
	}

	cursor, err := deviceCollection.Find(ctx, bson.M{"ownerId": owner.Id})
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

func FindJewelsByOwner(owner string) ([]Device, error) {
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

func GetJewelsById(id string) ([]Device, error) {
	client, err := OpenConnection()
	if err != nil {
		return nil, err
	}

	defer CloseConnection(client)

	ctx, cancelFunc := GetContext()
	defer cancelFunc()

	deviceCollection := GetDevicesCollection(client)
	cursor, err := deviceCollection.Find(ctx, bson.M{"id": id})
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

func DeleteMyJewel(email, jewel string) error {
	client, err := OpenConnection()
	if err != nil {
		return err
	}

	defer CloseConnection(client)

	ctx, cancelFunc := GetContext()
	defer cancelFunc()

	deviceCollection := GetDevicesCollection(client)
	owner, err := FindOwnerByEmail(email)
	if err != nil {
		return err
	}

	_, err = deviceCollection.DeleteOne(ctx, bson.M{"ownerId": owner.Id, "id": jewel})

	return err
}

func DeleteJewelByOwner(owner, jewel string) error {
	client, err := OpenConnection()
	if err != nil {
		return err
	}

	defer CloseConnection(client)

	ctx, cancelFunc := GetContext()
	defer cancelFunc()

	deviceCollection := GetDevicesCollection(client)
	_, err = deviceCollection.DeleteOne(ctx, bson.M{"ownerId": owner, "id": jewel})

	return err
}

func CreateJewel(email string, device Device) (*Device, error) {
	client, err := OpenConnection()
	if err != nil {
		return nil, err
	}

	defer CloseConnection(client)

	ctx, cancelFunc := GetContext()
	defer cancelFunc()

	deviceCollection := GetDevicesCollection(client)
	owner, err := FindOwnerByEmail(email)
	if err != nil {
		return nil, err
	}

	if device.Id == "" {
		device.Id = uuid.New().String()
	}

	device.OwnerId = *owner.Id
	_, err = deviceCollection.InsertOne(ctx, device)

	return &device, err
}

func CreateJewelByOwner(owner string, device Device) (*Device, error) {
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

func CreateToken(email, token string) error {
	client, err := OpenConnection()
	if err != nil {
		return err
	}

	defer CloseConnection(client)

	ctx, cancelFunc := GetContext()
	defer cancelFunc()

	ownerCollection := GetOwnersCollection(client)
	_, err = ownerCollection.UpdateOne(ctx, bson.M{"email": email}, bson.M{"$push": bson.M{"tokens": token}})

	return err
}

func CreateTokenByOwner(owner, token string) error {
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

func UpdateJewel(email string, device Device) error {
	client, err := OpenConnection()
	if err != nil {
		return err
	}

	defer CloseConnection(client)

	ctx, cancelFunc := GetContext()
	defer cancelFunc()

	deviceCollection := GetDevicesCollection(client)
	owner, err := FindOwnerByEmail(email)
	if err != nil {
		return err
	}

	if device.Id == "" {
		device.Id = uuid.New().String()
	}

	if checkJewelOwnerByEmail(email, device.Id) {
		return ErrNotSameOwner
	}

	device.OwnerId = *owner.Id

	_, err = deviceCollection.UpdateOne(ctx, bson.M{"id": device.Id, "ownerId": device.OwnerId}, bson.M{"$set": device})

	return err
}

func UpdateJewelByOwner(owner string, device Device) error {
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

	_, err = deviceCollection.UpdateOne(ctx, bson.M{"id": device.Id, "ownerId": device.OwnerId}, bson.M{"$set": device})

	return err
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
	count, err := deviceCollection.CountDocuments(ctx, bson.M{"ownerId": ownerId, "id": deviceId}, options.Count().SetLimit(1))

	return count > 0 && err != nil
}

func checkJewelOwnerByEmail(email, deviceId string) bool {
	client, err := OpenConnection()
	if err != nil {
		return false
	}

	defer CloseConnection(client)

	ctx, cancelFunc := GetContext()
	defer cancelFunc()

	deviceCollection := GetDevicesCollection(client)
	owner, err := FindOwnerByEmail(email)
	if err != nil {
		return false
	}

	count, err := deviceCollection.CountDocuments(ctx, bson.M{"ownerId": owner.Id, "id": deviceId}, options.Count().SetLimit(1))

	return count > 0 && err != nil
}
