package icons

import (
	"encoding/json"
	"fmt"
	"io"
	"jewels/database"
	"net/http"
	"os"
	"path"
)

const (
	brandIconsJsonPath = "https://raw.githubusercontent.com/selfhst/icons/refs/heads/main/index.json"
)

func getBrandIcons() ([]database.BrandIcon, error) {
	resp, err := http.Get(brandIconsJsonPath)
	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()
	decoder := json.NewDecoder(resp.Body)

	var iconsArray []database.BrandIcon

	err = decoder.Decode(&iconsArray)
	return iconsArray, err
}

func updateBrandIconCache() error {
	icons, err := getBrandIcons()
	if err != nil {
		return err
	}

	return database.UpdateBrandIconCache(icons)
}

func FetchAndCacheBrandIcon(icon *database.BrandIcon) ([]byte, error) {
	iconCachePath := os.Getenv("ICONS_CACHE_PATH")
	if iconCachePath == "" {
		return nil, fmt.Errorf("ICON_CACHE_PATH environment variable not set")
	}

	err := os.MkdirAll(iconCachePath, 0755)
	if err != nil {
		return nil, err
	}

	savePath := path.Join(iconCachePath, icon.Reference+".webp")
	if _, err := os.Stat(savePath); os.IsNotExist(err) {
		iconPath := fmt.Sprintf("https://cdn.jsdelivr.net/gh/selfhst/icons@main/webp/%s.webp", icon.Reference)
		resp, err := http.Get(iconPath)
		if err != nil {
			return nil, err
		}

		defer resp.Body.Close()

		data, err := io.ReadAll(resp.Body)
		if err != nil {
			return nil, err
		}

		err = os.WriteFile(savePath, data, 0644)

		return data, err
	}

	return os.ReadFile(savePath)
}
