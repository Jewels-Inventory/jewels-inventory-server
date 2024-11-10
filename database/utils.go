package database

import (
	"context"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
	"jewels/config"
	"time"
)

func GetContext() (context.Context, context.CancelFunc) {
	return context.WithTimeout(context.Background(), 10*time.Second)
}

func OpenConnection() (*mongo.Client, error) {
	ctx, cancelFunc := GetContext()
	defer cancelFunc()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(config.LoadedConfiguration.MongoUrl))
	if err != nil {
		return nil, err
	}

	err = client.Ping(ctx, readpref.Primary())
	if err != nil {
		return nil, err
	}

	return client, nil
}

func CloseConnection(client *mongo.Client) {
	ctx, cancelFunc := GetContext()
	defer cancelFunc()

	_ = client.Disconnect(ctx)
}

func GetDatabase(client *mongo.Client) *mongo.Database {
	return client.Database(config.LoadedConfiguration.MongoDatabase)
}

func GetOwnersCollection(client *mongo.Client) *mongo.Collection {
	return GetDatabase(client).Collection("owners")
}

func GetDevicesCollection(client *mongo.Client) *mongo.Collection {
	return GetDatabase(client).Collection("devices")
}
