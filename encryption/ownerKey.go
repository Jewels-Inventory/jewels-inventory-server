package encryption

import (
	"bytes"
	"crypto/rand"
	"io"

	"filippo.io/age"
)

func CreateOwnerKey() (string, error) {
	return EncryptString(rand.Text())
}

func EncryptOwnerString(data, encryptedOwnerKey string) (string, error) {
	recipient, err := getRecipient(encryptedOwnerKey)
	if err != nil {
		return "", err
	}

	return encryptString(recipient, data)
}

func EncryptOwnerList(data []string, encryptedOwnerKey string) ([]string, error) {
	recipient, err := getRecipient(encryptedOwnerKey)
	if err != nil {
		return nil, err
	}

	result := make([]string, len(data))
	for i, item := range data {
		result[i], err = encryptString(recipient, item)
		if err != nil {
			return nil, err
		}
	}

	return result, nil
}

func DecryptOwnerString(data, encryptedOwnerKey string) (string, error) {
	identity, err := getIdentity(encryptedOwnerKey)
	if err != nil {
		return "", err
	}

	return decryptString(identity, data)
}

func DecryptOwnerList(data []string, encryptedOwnerKey string) ([]string, error) {
	identity, err := getIdentity(encryptedOwnerKey)
	if err != nil {
		return nil, err
	}

	result := make([]string, len(data))
	for i, item := range data {
		result[i], err = decryptString(identity, item)
		if err != nil {
			return nil, err
		}
	}

	return result, nil
}

func getRecipient(encryptedOwnerKey string) (age.Recipient, error) {
	decryptedOwnerKey, err := DecryptString(encryptedOwnerKey)
	if err != nil {
		return nil, err
	}

	return age.NewScryptRecipient(decryptedOwnerKey)
}

func getIdentity(encryptedOwnerKey string) (age.Identity, error) {
	decryptedOwnerKey, err := DecryptString(encryptedOwnerKey)
	if err != nil {
		return nil, err
	}

	return age.NewScryptIdentity(decryptedOwnerKey)
}

func encryptString(recipient age.Recipient, data string) (string, error) {
	var buf bytes.Buffer
	w, err := age.Encrypt(&buf, recipient)
	if err != nil {
		return "", err
	}

	_, err = w.Write([]byte(data))
	if err != nil {
		return "", err
	}

	err = w.Close()
	if err != nil {
		return "", err
	}

	return buf.String(), nil
}

func decryptString(identity age.Identity, data string) (string, error) {
	buf := bytes.NewBufferString(data)
	r, err := age.Decrypt(buf, identity)
	if err != nil {
		return "", err
	}

	var out bytes.Buffer
	_, err = io.Copy(&out, r)
	if err != nil {
		return "", err
	}

	return out.String(), nil
}
