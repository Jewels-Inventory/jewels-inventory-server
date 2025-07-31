package database

func FindNextMonthEolDevices() ([]Device, error) {
	return Select[Device](`select * from devices where eol <= now() + interval '1 month'`)
}
