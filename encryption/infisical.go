package encryption

import (
	"context"
	"log/slog"
	"os"

	infisical "github.com/infisical/go-sdk"
)

var InfisicalClient infisical.InfisicalClientInterface

func SetupEncryption() {
	slog.Info("Connecting to Infisical service")
	client := infisical.NewInfisicalClient(context.Background(), infisical.Config{
		SiteUrl:          os.Getenv("INFISICAL_URL"),
		AutoTokenRefresh: true,
	})

	_, err := client.Auth().UniversalAuthLogin(os.Getenv("INFISICAL_CLIENT_ID"), os.Getenv("INFISICAL_CLIENT_SECRET"))
	if err != nil {
		panic(err)
	}

	InfisicalClient = client
}

func DecryptString(data string) (string, error) {
	slog.Info("Decrypting string from Infisical")
	return InfisicalClient.Kms().DecryptData(infisical.KmsDecryptDataOptions{
		Ciphertext: data,
		KeyId:      os.Getenv("INFISICAL_KEY_ID"),
	})
}

func EncryptString(data string) (string, error) {
	slog.Info("Encrypting string from Infisical")
	return InfisicalClient.Kms().EncryptData(infisical.KmsEncryptDataOptions{
		Plaintext: data,
		KeyId:     os.Getenv("INFISICAL_KEY_ID"),
	})
}
