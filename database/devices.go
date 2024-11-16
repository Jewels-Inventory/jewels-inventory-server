package database

import (
	"go.mongodb.org/mongo-driver/bson"
	"time"
)

func FindNextMonthEolDevices() ([]Device, error) {
	client, err := OpenConnection()
	if err != nil {
		return nil, err
	}

	defer CloseConnection(client)

	ctx, cancelFunc := GetContext()
	defer cancelFunc()

	deviceCollection := GetDevicesCollection(client)
	todayInAMonth := time.Now().AddDate(0, 1, 0)
	year, month, day := todayInAMonth.Date()
	cursor, err := deviceCollection.Find(ctx, bson.M{"eol": bson.M{"$lte": time.Date(year, month, day, 0, 0, 0, 0, time.UTC)}})
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
