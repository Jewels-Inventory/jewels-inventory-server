package mongo

import (
	"context"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
	"jewels/database"
	"log"
)

func ImportFromMongoDb(connectionString, dbName string) {
	serverAPI := options.ServerAPI(options.ServerAPIVersion1)
	log.Println("Connecting to MongoDB...")
	opts := options.Client().ApplyURI(connectionString).SetServerAPIOptions(serverAPI)
	client, err := mongo.Connect(opts)
	if err != nil {
		log.Fatalln(err)
	}

	db := client.Database(dbName)

	log.Println("Importing data...")
	ownersFromMongo, err := db.Collection("owners").Find(context.Background(), bson.D{})
	if err != nil {
		log.Fatalln(err)
	}

	owners := make([]Owner, 0)
	for ownersFromMongo.Next(context.Background()) {
		var owner Owner
		err = ownersFromMongo.Decode(&owner)
		if err != nil {
			log.Fatalln(err)
		}

		owners = append(owners, owner)
	}

	err = ownersFromMongo.Close(context.Background())
	if err != nil {
		log.Fatalln(err)
	}

	devicesFromMongo, err := db.Collection("devices").Find(context.Background(), bson.D{})
	if err != nil {
		log.Fatalln(err)
	}

	devices := make([]Device, 0)
	for devicesFromMongo.Next(context.Background()) {
		var device Device
		err = devicesFromMongo.Decode(&device)
		if err != nil {
			log.Fatalln(err)
		}

		devices = append(devices, device)
	}

	err = devicesFromMongo.Close(context.Background())
	if err != nil {
		log.Fatalln(err)
	}

	err = client.Disconnect(context.Background())
	if err != nil {
		log.Fatalln(err)
	}

	log.Println("Importing owners...")
	ownerPgIdByMongoId := make(map[string]int64)
	for _, owner := range owners {
		profilePicture := ""
		if owner.ProfilePicture != nil {
			profilePicture = *owner.ProfilePicture
		}

		o, err := database.CreateOwnerIfNotExists(owner.Email, owner.Name, profilePicture, owner.Roles)
		if err != nil {
			log.Fatalln(err)
		}

		for _, token := range owner.Tokens {
			err = database.CreateToken(o.Id, token)
			if err != nil {
				log.Fatalln(err)
			}
		}

		ownerPgIdByMongoId[owner.Id] = o.Id
	}

	log.Println("Importing devices...")
	for _, device := range devices {
		deviceToImport := database.Device{
			OwnerId:      ownerPgIdByMongoId[device.OwnerId],
			Type:         database.DeviceType(device.Type),
			Hostname:     device.Hostname,
			Model:        device.Model,
			Manufacturer: device.Manufacturer,
			Storage:      device.Storage,
			Ram:          device.Ram,
			Eol:          device.Eol,
			Notes:        device.Notes,
			Cpu:          nil,
			Bios:         nil,
			Mainboard:    nil,
			Kernel:       nil,
			Drives:       nil,
			Os:           nil,
		}

		cpu := database.Cpu{}
		if device.Cpu != nil {
			cpu.Manufacturer = device.Cpu.Manufacturer
			cpu.Model = device.Cpu.Model
			cpu.Speed = device.Cpu.Speed
			cpu.Cores = device.Cpu.Cores
			cpu.Threads = device.Cpu.Threads

			deviceToImport.Cpu = &cpu
		}

		bios := database.Bios{}
		if device.Bios != nil {
			bios.Manufacturer = device.Bios.Manufacturer
			bios.Version = device.Bios.Version

			deviceToImport.Bios = &bios
		}

		mainboard := database.Mainboard{}
		if device.Mainboard != nil {
			mainboard.Manufacturer = device.Mainboard.Manufacturer
			mainboard.Model = device.Mainboard.Model
			mainboard.Version = device.Mainboard.Version

			deviceToImport.Mainboard = &mainboard
		}

		kernel := database.Kernel{}
		if device.Kernel != nil {
			kernel.Version = device.Kernel.Version
			kernel.Architecture = device.Kernel.Architecture

			deviceToImport.Kernel = &kernel
		}

		os := database.OperatingSystem{}
		if device.Os != nil {
			os.Version = device.Os.Version
			os.Name = device.Os.Name

			deviceToImport.Os = &os
		}

		drives := make([]database.Drive, len(device.Drives))
		for i, drive := range device.Drives {
			drives[i].Size = drive.Size
			drives[i].Name = drive.Name
			drives[i].Manufacturer = drive.Manufacturer
			drives[i].Model = drive.Model
		}

		deviceToImport.Drives = drives

		err = database.CreateOrUpdateJewel(ownerPgIdByMongoId[device.OwnerId], &deviceToImport)
		if err != nil {
			log.Fatalln(err)
		}
	}

	log.Println("Importing data done.")
}
