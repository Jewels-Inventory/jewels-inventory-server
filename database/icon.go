package database

func UpdateBrandIconCache(icons []BrandIcon) error {
	tx, err := dbMap.Begin()
	if err != nil {
		return err
	}

	defer tx.Rollback()

	_, err = tx.Exec(`
delete
from brand_icons`)
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

func UpdateSimpleIconCache(icons []SimpleIcon) error {
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

func GetBrandIcon(icon string) (*BrandIcon, error) {
	return SelectOne[BrandIcon](`
select *
from brand_icons
where reference = $1`, icon)
}

func GetSimpleIcon(icon string) (*SimpleIcon, error) {
	return SelectOne[SimpleIcon](`
select *
from simple_icons
where slug = $1`, icon)
}
