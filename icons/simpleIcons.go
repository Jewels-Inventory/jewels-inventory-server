package icons

import (
	"encoding/json"
	"encoding/xml"
	"jewels/database"
	"net/http"
)

const (
	iconsJsonPath = "https://cdn.jsdelivr.net/npm/simple-icons-font@latest/font/simple-icons.json"
	svgFontPath   = "https://cdn.jsdelivr.net/npm/simple-icons-font@latest/font/SimpleIcons-Fit.svg"
)

type svgFont struct {
	Defs struct {
		Font struct {
			Glyph []struct {
				GlyphName string `xml:"glyph-name,attr"`
				Path      string `xml:"d,attr"`
			} `xml:"glyph"`
		} `xml:"font"`
	} `xml:"defs"`
}

func getIcons() ([]database.SimpleIcon, error) {
	resp, err := http.Get(iconsJsonPath)
	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()
	decoder := json.NewDecoder(resp.Body)

	var iconsArray []database.SimpleIcon

	err = decoder.Decode(&iconsArray)
	return iconsArray, err
}

func getGlyphs() (*svgFont, error) {
	resp, err := http.Get(svgFontPath)
	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()
	decoder := xml.NewDecoder(resp.Body)
	var data svgFont
	err = decoder.Decode(&data)
	return &data, err
}

func UpdateIconCache() error {
	icons, err := getIcons()
	if err != nil {
		return err
	}

	glyphs, err := getGlyphs()
	if err != nil {
		return err
	}

	for i, icon := range icons {
		for _, glyph := range glyphs.Defs.Font.Glyph {
			if glyph.GlyphName == icon.Slug {
				icon.IconData = glyph.Path
				icons[i] = icon
			}
		}
	}

	return database.UpdateIconCache(icons)
}
