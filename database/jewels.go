package database

import (
	"database/sql"
	"errors"
	"log/slog"
	"time"
)

func fillJewel(device *Device) (*Device, error) {
	drives, err := Select[Drive](`select * from drives where device_id = $1 order by id`, device.Id)
	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		return nil, err
	}

	cpu, err := SelectOne[Cpu](`select * from cpus where device_id = $1 order by id`, device.Id)
	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		return nil, err
	}

	bios, err := SelectOne[Bios](`select * from bios where device_id = $1 order by id`, device.Id)
	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		return nil, err
	}

	mainboard, err := SelectOne[Mainboard](`select * from mainboards where device_id = $1 order by id`, device.Id)
	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		return nil, err
	}

	kernel, err := SelectOne[Kernel](`select * from kernels where device_id = $1 order by id`, device.Id)
	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		return nil, err
	}

	operatingSystem, err := SelectOne[OperatingSystem](`select * from operating_systems where device_id = $1 order by id`, device.Id)
	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		return nil, err
	}

	device.Drives = drives
	device.Cpu = cpu
	device.Os = operatingSystem
	device.Bios = bios
	device.Mainboard = mainboard
	device.Kernel = kernel

	return device, nil
}

func FindJewels(owner int64) ([]Device, error) {
	jewels, err := Select[Device](`select * from devices where owner_id = $1 order by id`, owner)
	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		return nil, err
	}

	for i, jewel := range jewels {
		j, err := fillJewel(&jewel)
		if err != nil {
			return nil, err
		}

		jewels[i] = *j
	}

	return jewels, nil
}

func FindAllJewels() ([]Device, error) {
	return Select[Device](`select * from devices order by owner_id, type, manufacturer, model`)
}

func FindJewelByOwnerAndDeviceId(ownerId int64, deviceId string) (*Device, error) {
	jewel, err := SelectOne[Device](`select * from devices where owner_id = $1 and device_id = $2 order by owner_id, type, manufacturer, model`, ownerId, deviceId)
	if err != nil {
		return nil, err
	}

	return fillJewel(jewel)
}

func FindJewelByDeviceId(deviceId string) (*Device, error) {
	jewel, err := SelectOne[Device](`select * from devices where device_id = $1`, deviceId)
	if err != nil {
		return nil, err
	}

	return fillJewel(jewel)
}

func DeleteJewel(ownerId int64, jewel string) error {
	_, err := GetDbMap().Exec(`delete from devices where owner_id = $1 and device_id = $2`, ownerId, jewel)

	return err
}

func CreateJewel(owner int64, device *Device) (*Device, error) {
	tx, err := GetDbMap().Begin()
	if err != nil {
		return nil, err
	}

	device.OwnerId = owner

	err = tx.Insert(device)
	if err != nil {
		tx.Rollback()
		return nil, err
	}

	for _, drive := range device.Drives {
		drive.DeviceId = device.Id
		err = tx.Insert(&drive)
		if err != nil {
			tx.Rollback()
			return nil, err
		}
	}

	if device.Cpu != nil {
		device.Cpu.DeviceId = device.Id
		err = tx.Insert(device.Cpu)
		if err != nil {
			tx.Rollback()
			return nil, err
		}
	}

	if device.Bios != nil {
		device.Bios.DeviceId = device.Id
		err = tx.Insert(device.Bios)
		if err != nil {
			tx.Rollback()
			return nil, err
		}
	}

	if device.Mainboard != nil {
		device.Mainboard.DeviceId = device.Id
		err = tx.Insert(device.Mainboard)
		if err != nil {
			tx.Rollback()
		}
	}

	if device.Kernel != nil {
		device.Kernel.DeviceId = device.Id
		err = tx.Insert(device.Kernel)
		if err != nil {
			tx.Rollback()
			return nil, err
		}
	}

	if device.Os != nil {
		device.Os.DeviceId = device.Id
		err = tx.Insert(device.Os)
		if err != nil {
			tx.Rollback()
			return nil, err
		}
	}

	err = tx.Commit()
	if err != nil {
		return nil, err
	}

	err = SetAndroidDevice(device)
	if err != nil {
		slog.Warn("Failed to set android device information", "error", err)
	}

	return device, nil
}

func CreateToken(owner int64, token string) error {
	authToken := OwnerAuthToken{
		OwnerId: owner,
		Token:   token,
	}

	return GetDbMap().Insert(&authToken)
}

func UpdateJewel(owner int64, device *Device) error {
	device.OwnerId = owner

	tx, err := GetDbMap().Begin()
	if err != nil {
		return err
	}

	defer tx.Rollback()

	id, err := tx.SelectInt("select id from devices where owner_id = $1 and device_id = $2", owner, device.DeviceId)
	if err != nil {
		return err
	}

	device.Id = id

	_, err = tx.Update(device)
	if err != nil {
		return err
	}

	_, err = tx.Exec(`
delete
from drives
where device_id = $1`, device.Id)
	if err != nil {
		return err
	}

	for _, drive := range device.Drives {
		drive.DeviceId = device.Id
		err = tx.Insert(&drive)
		if err != nil {
			return err
		}
	}

	_, err = tx.Exec(`
delete
from cpus
where device_id = $1`, device.Id)
	if err != nil {
		return err
	}

	if device.Cpu != nil {
		device.Cpu.DeviceId = device.Id
		err = tx.Insert(device.Cpu)
		if err != nil {
			return err
		}
	}

	_, err = tx.Exec(`
delete
from bios
where device_id = $1`, device.Id)
	if err != nil {
		return err
	}

	if device.Bios != nil {
		device.Bios.DeviceId = device.Id
		err = tx.Insert(device.Bios)
		if err != nil {
			return err
		}
	}

	_, err = tx.Exec(`
delete
from mainboards
where device_id = $1`, device.Id)
	if err != nil {
		return err
	}

	if device.Mainboard != nil {
		device.Mainboard.DeviceId = device.Id
		err = tx.Insert(device.Mainboard)
		if err != nil {
			return err
		}
	}

	_, err = tx.Exec(`
delete
from kernels
where device_id = $1`, device.Id)
	if err != nil {
		return err
	}

	if device.Kernel != nil {
		device.Kernel.DeviceId = device.Id
		err = tx.Insert(device.Kernel)
		if err != nil {
			return err
		}
	}

	_, err = tx.Exec(`
delete
from operating_systems
where device_id = $1`, device.Id)
	if err != nil {
		return err
	}

	if device.Os != nil {
		device.Os.DeviceId = device.Id
		err = tx.Insert(device.Os)
		if err != nil {
			return err
		}
	}

	err = tx.Commit()
	if err != nil {
		return err
	}

	err = SetAndroidDevice(device)
	if err != nil {
		slog.Warn("Failed to set android device information", "error", err)
	}

	return nil
}

func CreateOrUpdateJewel(owner int64, device *Device) error {
	count, err := GetDbMap().SelectInt("select count(*) from devices where owner_id = $1 and device_id = $2", owner, device.DeviceId)
	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		return err
	}

	if count == 0 {
		_, err = CreateJewel(owner, device)
		return err
	}

	return UpdateJewel(owner, device)
}

func UpdateJewelEol(ownerId, deviceId int64, eol time.Time) error {
	_, err := dbMap.Exec(`
update devices
set eol = $1
where owner_id = $2
  and id = $3`, eol, ownerId, deviceId)

	return err
}
