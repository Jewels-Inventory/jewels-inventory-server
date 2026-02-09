package _import

import (
	"encoding/json"
	"jewels/database"
	"jewels/encryption"
	"os"
)

func ImportOtp(file string, userId int64) error {
	var accounts []struct {
		Issuer string `json:"issuer"`
		Name   string `json:"name"`
		Secret string `json:"secret"`
	}

	reader, err := os.Open(file)
	if err != nil {
		return err
	}

	defer reader.Close()

	err = json.NewDecoder(reader).Decode(&accounts)
	if err != nil {
		return err
	}

	otps := make([]database.OneTimePassword, len(accounts))
	owner, err := database.FindOwnerById(userId)
	if err != nil {
		return err
	}

	for i, account := range accounts {
		otp := database.OneTimePassword{
			OwnerId:       owner.Id,
			AccountIssuer: account.Issuer,
			AccountName:   account.Name,
			SecretKey:     account.Secret,
		}
		otps[i] = otp
	}

	unencryptedSecrets := make([]string, len(otps))
	for i, otp := range otps {
		unencryptedSecrets[i] = otp.SecretKey
	}

	ownerEncryptionKey, err := database.FindOwnerEncryptionKeyByOwner(owner)
	if err != nil {
		return err
	}

	encryptedSecrets, err := encryption.EncryptOwnerList(unencryptedSecrets, ownerEncryptionKey.EncryptedKey)
	if err != nil {
		return err
	}

	for i, _ := range otps {
		otps[i].EncryptedSecretKey = []byte(encryptedSecrets[i])
	}

	toInsert := make([]interface{}, len(otps))
	for i, otp := range otps {
		toInsert[i] = &otp
	}

	return database.GetDbMap().Insert(toInsert...)
}
