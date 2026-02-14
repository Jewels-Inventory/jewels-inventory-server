package icons

import (
	"encoding/json"
	"fmt"
	"io"
	"jewels/database"
	"net/http"
	"os"
	"path"
	"strings"
)

const (
	simpleIconsJsonPath = "https://cdn.jsdelivr.net/npm/simple-icons-font@latest/font/simple-icons.json"
)

func getSimpleIcons() ([]database.SimpleIcon, error) {
	resp, err := http.Get(simpleIconsJsonPath)
	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()
	decoder := json.NewDecoder(resp.Body)

	var iconsArray []database.SimpleIcon

	err = decoder.Decode(&iconsArray)
	return iconsArray, err
}

func updateSimpleIconCache() error {
	icons, err := getSimpleIcons()
	if err != nil {
		return err
	}

	return database.UpdateSimpleIconCache(icons)
}

func FetchAndCacheSimpleIcon(icon *database.SimpleIcon) ([]byte, error) {
	iconCachePath := os.Getenv("ICONS_CACHE_PATH")
	if iconCachePath == "" {
		return nil, fmt.Errorf("ICON_CACHE_PATH environment variable not set")
	}

	err := os.MkdirAll(iconCachePath, 0755)
	if err != nil {
		return nil, err
	}

	savePath := path.Join(iconCachePath, icon.Slug+".svg")
	if _, err := os.Stat(savePath); os.IsNotExist(err) {
		iconPath := fmt.Sprintf("https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/%s.svg", icon.Slug)
		resp, err := http.Get(iconPath)
		if err != nil {
			return nil, err
		}

		defer resp.Body.Close()

		data, err := io.ReadAll(resp.Body)
		if err != nil {
			return nil, err
		}

		data = []byte(strings.ReplaceAll(string(data), "<path d=", fmt.Sprintf(`<path fill="#%s" d=`, icon.Hex)))

		err = os.WriteFile(savePath, data, 0644)

		return data, err
	}

	return os.ReadFile(savePath)
}
