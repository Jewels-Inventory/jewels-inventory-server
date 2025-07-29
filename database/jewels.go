package database

func fillJewel(device *Device) error {
	drives, err := Select[Drive](`select * from drives where device_id = $1`, device.Id)
	if err != nil {
		return err
	}

	cpu, err := SelectOne[*Cpu](`select * from cpus where device_id = $1`, device.Id)
	if err != nil {
		return err
	}

	bios, err := SelectOne[*Bios](`select * from bios where device_id = $1`, device.Id)
	if err != nil {
		return err
	}

	mainboard, err := SelectOne[*Mainboard](`select * from mainboards where device_id = $1`, device.Id)
	if err != nil {
		return err
	}

	kernel, err := SelectOne[*Kernel](`select * from kernels where device_id = $1`, device.Id)
	if err != nil {
		return err
	}

	operatingSystem, err := SelectOne[*OperatingSystem](`select * from operating_systems where device_id = $1`, device.Id)
	if err != nil {
		return err
	}

	device.Drives = drives
	device.Cpu = cpu
	device.Os = operatingSystem
	device.Bios = bios
	device.Mainboard = mainboard
	device.Kernel = kernel

	return nil
}

func FindJewels(owner int64) ([]Device, error) {
	jewels, err := Select[Device](`select * from devices where owner_id = $1`, owner)
	if err != nil {
		return nil, err
	}

	for _, jewel := range jewels {
		return nil, fillJewel(&jewel)
	}

	return jewels, nil
}

func FindJewelById(id int64) (*Device, error) {
	jewel, err := SelectOne[Device](`select * from devices where id = $1`, id)
	if err != nil {
		return nil, err
	}

	return &jewel, fillJewel(&jewel)
}

func DeleteJewel(ownerId, jewel int64) error {
	_, err := GetDbMap().Exec(`delete from devices where owner_id = $1 and id = $2`, ownerId, jewel)

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
		err = tx.Insert(drive)
		if err != nil {
			tx.Rollback()
			return nil, err
		}
	}

	device.Cpu.DeviceId = device.Id
	err = tx.Insert(device.Cpu)
	if err != nil {
		tx.Rollback()
		return nil, err
	}

	device.Bios.DeviceId = device.Id
	err = tx.Insert(device.Bios)
	if err != nil {
		tx.Rollback()
		return nil, err
	}

	device.Mainboard.DeviceId = device.Id
	err = tx.Insert(device.Mainboard)
	if err != nil {
		tx.Rollback()
	}

	device.Kernel.DeviceId = device.Id
	err = tx.Insert(device.Kernel)
	if err != nil {
		tx.Rollback()
		return nil, err
	}

	device.Os.DeviceId = device.Id
	err = tx.Insert(device.Os)
	if err != nil {
		tx.Rollback()
		return nil, err
	}

	return device, tx.Commit()
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

	_, err = tx.Update(device)
	if err != nil {
		tx.Rollback()
		return err
	}

	for _, drive := range device.Drives {
		drive.DeviceId = device.Id
		_, err = tx.Update(drive)
		if err != nil {
			tx.Rollback()
			return err
		}
	}

	_, err = tx.Update(device.Cpu)
	if err != nil {
		tx.Rollback()
		return err
	}

	_, err = tx.Update(device.Bios)
	if err != nil {
		tx.Rollback()
		return err
	}

	_, err = tx.Update(device.Mainboard)
	if err != nil {
		tx.Rollback()
		return err
	}

	_, err = tx.Update(device.Kernel)
	if err != nil {
		tx.Rollback()
		return err
	}

	_, err = tx.Update(device.Os)
	if err != nil {
		tx.Rollback()
		return err
	}

	return tx.Commit()
}

func CreateOrUpdateJewel(owner int64, device *Device) error {
	count, err := GetDbMap().SelectInt("select count(*) from devices where owner = $1 and id = $2", owner, device.Id)
	if err != nil {
		return err
	}

	if count == 0 {
		_, err = CreateJewel(owner, device)
		return err
	}

	return UpdateJewel(owner, device)
}
