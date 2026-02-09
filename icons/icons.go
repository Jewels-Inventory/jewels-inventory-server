package icons

import "log/slog"

func UpdateIconCache() {
	err := updateSimpleIconCache()
	if err != nil {
		slog.Warn("Failed to update simple icon cache")
		return
	}

	err = updateBrandIconCache()
	if err != nil {
		slog.Warn("Failed to update brand icon cache")
	}
}
