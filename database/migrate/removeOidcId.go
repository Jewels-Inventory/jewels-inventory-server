package migrate

import (
	"go.mongodb.org/mongo-driver/bson"
	"jewels/database"
)

func RemoveOidcId() {
	client, err := database.OpenConnection()
	if err != nil {
		panic(err)
	}

	ctx, cancelFunc := database.GetContext()
	defer cancelFunc()

	defer database.CloseConnection(client)

	ownersCollection := database.GetOwnersCollection(client)

	_, err = ownersCollection.UpdateMany(ctx, bson.M{}, bson.M{"$unset": bson.M{"oidcId": ""}})
	if err != nil {
		panic(err)
	}
}
