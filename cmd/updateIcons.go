package cmd

import (
	"jewels/icons"
	"log/slog"

	"github.com/spf13/cobra"
)

func GetUpdateIconsCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "update-icons",
		Short: "Update all known brand icons",
		Run: func(cmd *cobra.Command, args []string) {
			slog.Info("Replace all simple icons")
			err := icons.UpdateIconCache()
			if err != nil {
				slog.Error("Failed to update icon cache", "error", err)
			} else {
				slog.Info("Updated icon cache")
			}
		},
	}
}
