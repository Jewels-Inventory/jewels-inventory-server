package mailing

import (
	"embed"
	"html/template"
	"jewels/config"
	"jewels/database"
	"strings"

	"github.com/wneessen/go-mail"
)

//go:generate npx --yes mjml -r templates/admin.mjml templates/owner.mjml -o templates

//go:embed templates
var templates embed.FS

//go:embed assets
var assets embed.FS

type emailData struct {
	Device     database.Device
	Owner      database.Owner
	Admin      database.Owner
	Title      string
	AdminNames string
	To         string
	EolString  string
}

func buildMessage(body *template.Template, data emailData) (*mail.Msg, error) {
	msg := mail.NewMsg()
	if err := msg.From(config.LoadedConfiguration.MailerFrom); err != nil {
		return nil, err
	}
	if err := msg.To(data.To); err != nil {
		return nil, err
	}

	if err := msg.SetBodyHTMLTemplate(body, data); err != nil {
		return nil, err
	}

	if err := msg.EmbedFromEmbedFS("assets/logo.png", &assets, func(file *mail.File) {
		file.Name = "logo"
	}); err != nil {
		return nil, err
	}

	if err := msg.EmbedFromEmbedFS("assets/background.jpg", &assets, func(file *mail.File) {
		file.Name = "background"
	}); err != nil {
		return nil, err
	}

	msg.Subject(data.Title)

	return msg, nil
}

func sendMessages(message ...*mail.Msg) error {
	client, err := mail.NewClient(config.LoadedConfiguration.MailerHost, mail.WithPort(config.LoadedConfiguration.MailerPort), mail.WithSMTPAuth(config.LoadedConfiguration.MailerSmtpAuth), mail.WithSSL(), mail.WithUsername(config.LoadedConfiguration.MailerUser), mail.WithPassword(config.LoadedConfiguration.MailerPassword))
	if err != nil {
		return err
	}

	return client.DialAndSend(message...)
}

func SendEolMail(device database.Device, owner database.Owner) error {
	adminTmpl, err := template.ParseFS(templates, "templates/admin.html")
	if err != nil {
		return err
	}

	ownerTmpl, err := template.ParseFS(templates, "templates/admin.html")
	if err != nil {
		return err
	}

	admins, err := database.FindAllAdmins()
	adminNames := make([]string, len(admins))
	for i, admin := range admins {
		adminNames[i] = admin.Name
	}

	adminsString := strings.Join(adminNames[:len(adminNames)-1], ", ")
	if len(adminsString) > 1 {
		adminsString += " und " + adminNames[len(adminNames)-1]
	}

	msgs := make([]*mail.Msg, len(admins)+1)
	msgs[0], err = buildMessage(ownerTmpl, emailData{
		Device:     device,
		Owner:      owner,
		AdminNames: adminsString,
		Title:      "Dein " + device.Model + " hat bald keinen Support mehr",
		To:         owner.Email,
		EolString:  device.Eol.Format("02.01.2006"),
	})

	if err != nil {
		return err
	}

	for i, admin := range admins {
		msgs[i+1], err = buildMessage(adminTmpl, emailData{
			Device:     device,
			Owner:      owner,
			Admin:      admin,
			AdminNames: adminsString,
			Title:      "Das " + device.Model + " von " + owner.Name + " hat bald keinen Support mehr",
			To:         admin.Email,
			EolString:  device.Eol.Format("02.01.2006"),
		})
		if err != nil {
			return err
		}
	}

	return sendMessages(msgs...)
}
