package jobs

import (
	"jewels/icons"
	"log/slog"
)

type UpdateIcons struct{}

func (UpdateIcons) Run() {
	slog.Info("Replace all brand icons")
	icons.UpdateIconCache()
}
