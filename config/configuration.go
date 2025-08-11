package config

import (
	"fmt"

	"github.com/wneessen/go-mail"
	"go-simpler.org/env"
)

type Configuration struct {
	OidcFrontendClientId      string            `env:"OIDC_FRONTEND_CLIENT_ID"`
	OidcDomain                string            `env:"OIDC_DOMAIN"`
	OidcServerClientId        string            `env:"OIDC_SERVER_CLIENT_ID"`
	OidcServerClientSecret    string            `env:"OIDC_SERVER_CLIENT_SECRET"`
	ServerUrl                 string            `env:"SERVER_URL"`
	MailerFrom                string            `env:"MAILER_FROM" default:"jewels@ulbricht.cloud"`
	MailerHost                string            `env:"MAILER_HOST" default:"mail.ulbricht.cloud"`
	MailerPort                int               `env:"MAILER_PORT" default:"465"`
	MailerUser                string            `env:"MAILER_USER" default:"jewels@ulbricht.cloud"`
	MailerPassword            string            `env:"MAILER_PASSWORD" default:""`
	MailerSmtpAuth            mail.SMTPAuthType `env:"MAILER_AUTH" default:"PLAIN"`
	RelayVpnServer            string            `env:"RELAY_VPN_SERVER" default:""`
	RelayVpnServerAccessToken string            `env:"RELAY_VPN_SERVER_ACCESS_TOKEN" default:""`
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
