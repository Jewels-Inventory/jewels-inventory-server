package database

import (
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func CreateOwnerIfNotExists(email, name, profilePicture string, roles []string) error {
	client, err := OpenConnection()
	if err != nil {
		return err
	}

	defer CloseConnection(client)

	ctx, cancelFunc := GetContext()
	defer cancelFunc()

	ownerCollection := GetOwnersCollection(client)

	count, err := ownerCollection.CountDocuments(ctx, bson.M{"email": email}, options.Count().SetLimit(1))
	if err != nil {
		return err
	}

	if count > 0 {
		return nil
	}

	_, err = ownerCollection.InsertOne(ctx, Owner{
		Name:           name,
		Email:          email,
		Tokens:         []string{},
		Roles:          roles,
		ProfilePicture: &profilePicture,
	})

	return err
}

func FindOwnerByEmail(email string) (*Owner, error) {
	client, err := OpenConnection()
	if err != nil {
		return nil, err
	}

	defer CloseConnection(client)

	ctx, cancelFunc := GetContext()
	defer cancelFunc()

	ownerCollection := GetOwnersCollection(client)

	result := ownerCollection.FindOne(ctx, bson.M{"email": email})
	if result.Err() != nil {
		return nil, result.Err()
	}

	owner := new(Owner)

	err = result.Decode(owner)

	return owner, err
}
