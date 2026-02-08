package ntfy

import (
	"context"
	"encoding/base64"
	"fmt"
	"log/slog"
	"net/url"
	"os"

	"github.com/AnthonyHewins/gotfy"
)

func SendFatalErrorNotification(title, message string) {
	SendMessage(title, message, gotfy.Max)
}

func SendMessage(title, message string, priority gotfy.Priority) {
	server, _ := url.Parse(os.Getenv("NTFY_SERVER"))
	tp, err := gotfy.NewPublisher(server)
	if err != nil {
		slog.Warn("Failed to create publisher", "error", err)
		return
	}

	tp.Headers.Set("Authorization", "Basic "+base64.StdEncoding.EncodeToString([]byte(fmt.Sprintf("%s:%s", os.Getenv("NTFY_USER"), os.Getenv("NTFY_PASSWORD")))))
	_, err = tp.SendMessage(context.Background(), &gotfy.Message{
		Topic:    os.Getenv("NTFY_TOPIC"),
		Message:  message,
		Title:    title,
		Priority: priority,
	})
	if err != nil {
		slog.Warn("Failed to send notification", "error", err)
	}
}
