package database

func FindNextMonthEolDevices() ([]Device, error) {
	return Select[Device](`
select *
from devices
where eol <= now() + interval '1 month'`)
}

func FindNextMonthEolDevicesByUser(userId int64) ([]Device, error) {
	return Select[Device](`
select *
from devices
where eol <= now() + interval '1 month'
  and owner_id = $1`, userId)
}
