package database

import (
	"encoding/csv"
	"io"
	"log/slog"
	"net/http"

	"golang.org/x/text/encoding/unicode"
	"golang.org/x/text/transform"
)

func ReplaceAndroidDevices() error {
	res, err := http.Get("https://storage.googleapis.com/play_public/supported_devices.csv")
	if err != nil {
		return err
	}

	defer res.Body.Close()
	utf16Decoder := unicode.UTF16(unicode.LittleEndian, unicode.ExpectBOM).NewDecoder()

	csvReader := csv.NewReader(transform.NewReader(res.Body, utf16Decoder))
	csvReader.ReuseRecord = true

	tx, err := dbMap.Begin()
	if err != nil {
		return err
	}

	defer tx.Rollback()

	_, err = tx.Exec(`
delete
from android_devices`)
	if err != nil {
		return err
	}

	record, err := csvReader.Read()
	for {
		record, err = csvReader.Read()
		if err == io.EOF {
			break
		} else if err != nil {
			return err
		}

		_, err = tx.Exec(`
insert into android_devices (retail_branding, marketing_name, device, model)
values ($1, $2, $3, $4)`, record[0], record[1], record[2], record[3])
		if err != nil {
			slog.Error("Failed to insert android device", "error", err, "record", record)
		}
	}

	return tx.Commit()
}

func SetAndroidDevice(device *Device) error {
	androidDevice, err := SelectOne[AndroidDevice](`
select *
from android_devices
where model ilike $1`, device.Model)
	if err != nil {
		return nil
	}

	_, err = dbMap.Exec(`
update devices
set model = $1, manufacturer = $2
where id = $3`, androidDevice.MarketingName, androidDevice.RetailBranding, device.Id)

	return err
}
