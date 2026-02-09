package icons

import (
	"bytes"
	"encoding/json"
	"fmt"
	"image"
	"image/draw"
	"image/png"
	"io"
	"jewels/database"
	"net/http"
	"os"
	"path"

	"github.com/h2non/bimg"
	"github.com/srwiley/oksvg"
	"github.com/srwiley/rasterx"
)

const (
	simpleIconsJsonPath = "https://cdn.jsdelivr.net/npm/simple-icons-font@latest/font/simple-icons.json"
)

type Svg struct {
	Path svgPath `xml:"path"`
}

type svgPath struct {
	D string `xml:"d,attr"`
}

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

func rasterizeSvgToPng(svgData []byte, width, height int, newColor string) ([]byte, error) {
	icon, err := oksvg.ReadIconStream(bytes.NewReader(svgData), oksvg.StrictErrorMode)
	if err != nil {
		return nil, err
	}

	clr, err := oksvg.ParseSVGColor(newColor)
	if err != nil {
		return nil, err
	}

	for i := range icon.SVGPaths {
		p := &icon.SVGPaths[i]
		p.SetFillColor(clr)
	}

	icon.SetTarget(0, 0, float64(width), float64(height))

	rgba := image.NewRGBA(image.Rect(0, 0, width, height))
	draw.Draw(rgba, rgba.Bounds(), image.Transparent, image.Point{}, draw.Src)

	scanner := rasterx.NewScannerGV(width, height, rgba, rgba.Bounds())
	raster := rasterx.NewDasher(width, height, scanner)

	icon.Draw(raster, 1.0)

	var buf bytes.Buffer
	if err := png.Encode(&buf, rgba); err != nil {
		return nil, err
	}

	return buf.Bytes(), nil
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

	savePath := path.Join(iconCachePath, icon.Slug+".webp")
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

		pngBytes, err := rasterizeSvgToPng(data, 512, 512, "#"+icon.Hex)
		if err != nil {
			return nil, err
		}

		img := bimg.NewImage(pngBytes)
		webpData, err := img.Convert(bimg.WEBP)
		if err != nil {
			return nil, err
		}

		err = os.WriteFile(savePath, webpData, 0644)

		return webpData, err
	}

	return os.ReadFile(savePath)
}
