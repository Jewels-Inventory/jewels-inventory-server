package database

import (
	"slices"
)

func CreateOwnerIfNotExists(email, name, profilePicture string, roles []string) (*Owner, error) {
	owner := Owner{
		Name:           name,
		Email:          email,
		IsAdmin:        slices.Contains(roles, "admin"),
		ProfilePicture: &profilePicture,
	}

	o, err := FindOwnerByEmail(email)
	if err != nil {
		return nil, err
	}

	if o != nil {
		return o, nil
	}
	err = GetDbMap().Insert(&owner)

	return &owner, err
}

func FindOwnerById(id int64) (*Owner, error) {
	return Get[Owner](id)
}

func FindOwnerByEmail(email string) (*Owner, error) {
	return SelectOne[*Owner]("select * from owners where email = $1", email)
}

func FindOwnerByToken(token string) (*Owner, error) {
	return SelectOne[*Owner]("select * from owners o inner join owner_auth_tokens oat on oat.owner_id = o.id where oat.token = $1", token)
}

func FindAllOwners() ([]Owner, error) {
	return Select[Owner]("select * from owners")
}

func FindAllAdmins() ([]Owner, error) {
	return Select[Owner]("select * from owners where is_admin = true")
}
