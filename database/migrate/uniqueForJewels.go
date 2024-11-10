package migrate

import (
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"jewels/database"
)

const JewelIdUniqueIdx = "jewel-id-unique"

func CreateUniqueForJewels() {
	client, err := database.OpenConnection()
	if err != nil {
		panic(err)
	}

	ctx, cancelFunc := database.GetContext()
	defer cancelFunc()

	defer database.CloseConnection(client)

	jewelsCollection := database.GetDevicesCollection(client)

	cursor, err := jewelsCollection.Indexes().List(ctx)
	if err != nil {
		panic(err)
	}

	var indexes []bson.M
	if err = cursor.All(ctx, &indexes); err != nil {
		panic(err)
	}

	for _, index := range indexes {
		if index["name"] == JewelIdUniqueIdx {
			return
		}
	}

	_, err = jewelsCollection.Indexes().CreateOne(
		ctx,
		mongo.IndexModel{
			Keys:    bson.D{{Key: "id", Value: 1}},
			Options: options.Index().SetUnique(true).SetName(JewelIdUniqueIdx),
		},
	)

	if err != nil {
		panic(err)
	}
}
