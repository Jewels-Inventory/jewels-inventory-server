package cmd

import (
	"jewels/eol"

	"github.com/spf13/cobra"
)

func GetCheckEolCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "check-eol",
		Short: "Checks all known devices for eol",
		Run: func(cmd *cobra.Command, args []string) {
			eol.CheckEol()
		},
	}
}
