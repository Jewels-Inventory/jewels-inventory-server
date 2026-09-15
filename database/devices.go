package database

func FindNextMonthEolDevices() ([]Device, error) {
	return dbMap.SelectType[Device](`
select *
from devices
where eol = current_date + interval '1 month'`)
}

func FindNextMonthEolDevicesByUser(userId int64) ([]Device, error) {
	return dbMap.SelectType[Device](`
select *
from devices
where eol = current_date + interval '1 month'
  and owner_id = $1`, userId)
}
