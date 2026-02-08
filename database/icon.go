package database

func UpdateIconCache(icons []SimpleIcon) error {
	tx, err := dbMap.Begin()
	if err != nil {
		return err
	}

	defer tx.Rollback()

	_, err = tx.Exec(`
delete
from simple_icons`)
	if err != nil {
		return err
	}

	for _, icon := range icons {
		err = tx.Insert(&icon)
		if err != nil {
			return err
		}
	}

	return tx.Commit()
}

func GetIcons() ([]SimpleIcon, error) {
	return Select[SimpleIcon](`
select *
from simple_icons`)
}
