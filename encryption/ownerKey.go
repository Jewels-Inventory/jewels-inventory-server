package encryption

import (
	"crypto/cipher"
	"crypto/rand"
	"fmt"

	"golang.org/x/crypto/chacha20poly1305"
)

func CreateOwnerKey() (string, error) {
	data := make([]byte, 32)
	_, err := rand.Read(data)
	if err != nil {
		return "", err
	}

	return EncryptString(string(data))
}

func EncryptOwnerString(data, encryptedOwnerKey string) ([]byte, error) {
	aead, err := getAead(encryptedOwnerKey)
	if err != nil {
		return nil, err
	}

	return encrypt(aead, []byte(data))
}

func EncryptOwnerList(data []string, encryptedOwnerKey string) ([][]byte, error) {
	aead, err := getAead(encryptedOwnerKey)
	if err != nil {
		return nil, err
	}

	result := make([][]byte, len(data))
	for i, item := range data {
		result[i], err = encrypt(aead, []byte(item))
		if err != nil {
			return nil, err
		}
	}

	return result, nil
}

func DecryptOwnerString(data []byte, encryptedOwnerKey string) (string, error) {
	aead, err := getAead(encryptedOwnerKey)
	if err != nil {
		return "", err
	}

	res, err := decrypt(aead, data)
	if err != nil {
		return "", err
	}

	return string(res), nil
}

func DecryptOwnerList(data [][]byte, encryptedOwnerKey string) ([]string, error) {
	aead, err := getAead(encryptedOwnerKey)
	if err != nil {
		return nil, err
	}

	result := make([]string, len(data))
	for i, item := range data {
		res, err := decrypt(aead, item)
		if err != nil {
			return nil, err
		}
		result[i] = string(res)
	}

	return result, nil
}

func getAead(key string) (cipher.AEAD, error) {
	decryptedOwnerKey, err := DecryptString(string(key))
	if err != nil {
		return nil, err
	}

	return chacha20poly1305.New([]byte(decryptedOwnerKey))
}

func encrypt(aead cipher.AEAD, data []byte) ([]byte, error) {
	nonce := make([]byte, chacha20poly1305.NonceSize)
	if _, err := rand.Read(nonce); err != nil {
		return nil, err
	}

	ciphertext := aead.Seal(nonce, nonce, data, nil)
	return ciphertext, nil
}

func decrypt(aead cipher.AEAD, data []byte) ([]byte, error) {
	nonceSize := chacha20poly1305.NonceSize
	if len(data) < nonceSize {
		return nil, fmt.Errorf("ciphertext too short")
	}

	nonce := data[:nonceSize]
	actualCiphertext := data[nonceSize:]

	return aead.Open(nil, nonce, actualCiphertext, nil)
}
