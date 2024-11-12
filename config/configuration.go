package config

import (
	"fmt"
	"go-simpler.org/env"
)

type Configuration struct {
	MongoUrl               string `env:"MONGO_URL"`
	MongoDatabase          string `env:"MONGO_DATABASE"`
	OidcFrontendClientId   string `env:"OIDC_FRONTEND_CLIENT_ID"`
	OidcDomain             string `env:"OIDC_DOMAIN"`
	OidcServerClientId     string `env:"OIDC_SERVER_CLIENT_ID"`
	OidcServerClientSecret string `env:"OIDC_SERVER_CLIENT_SECRET"`
	ServerUrl              string `env:"SERVER_URL"`
	SecretKey              string `env:"SECRET_KEY"`
}

func (c Configuration) GetRedirectUrl() string {
	return fmt.Sprintf("%s/login/callback", c.ServerUrl)
}

var LoadedConfiguration *Configuration

func LoadConfiguration() error {
	config := new(Configuration)
	err := env.Load(config, nil)
	if err != nil {
		return err
	}

	LoadedConfiguration = config

	return nil
}
