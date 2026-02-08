package logging

import (
	"context"
	"fmt"
	"jewels/ntfy"
	"log/slog"
	"os"
	"time"
)

func notifyFatal(record slog.Record) {
	go func() {
		body := struct {
			Time    time.Time
			Message string
			Source  string
			Args    []string
		}{
			Time:    record.Time,
			Message: record.Message,
			Args:    []string{},
		}
		src := record.Source()
		body.Source = fmt.Sprintf("%s@%s:%d", src.Function, src.File, src.Line)

		message := fmt.Sprintf("Time: %s\nMessage: %s\nSource: %s", record.Time.Format(time.DateTime), body.Message, body.Source)
		record.Attrs(func(attr slog.Attr) bool {
			message += " - " + attr.String()

			return true
		})

		ntfy.SendFatalErrorNotification("Severe failure", message)
	}()
}

type customHandler struct {
	baseHandler slog.Handler
}

func (c customHandler) Enabled(ctx context.Context, level slog.Level) bool {
	return c.baseHandler.Enabled(ctx, level)
}

func (c customHandler) Handle(ctx context.Context, record slog.Record) error {
	if record.Level == slog.LevelError {
		notifyFatal(record)
	}

	return c.baseHandler.Handle(ctx, record)
}

func (c customHandler) WithAttrs(attrs []slog.Attr) slog.Handler {
	return c.baseHandler.WithAttrs(attrs)
}

func (c customHandler) WithGroup(name string) slog.Handler {
	return c.baseHandler.WithGroup(name)
}

func SetupLogging() {
	slogLevel := slog.LevelInfo
	switch os.Getenv("LOG_LEVEL") {
	case "debug":
		slogLevel = slog.LevelDebug
	case "warn":
		slogLevel = slog.LevelWarn
	case "error":
		slogLevel = slog.LevelError
	}

	slog.SetDefault(slog.New(customHandler{
		baseHandler: slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{
			Level:     slogLevel,
			AddSource: true,
		}),
	}))
}
