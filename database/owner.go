package database

import (
	"database/sql"
	"errors"
	"jewels/encryption"
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
	if err != nil && !errors.Is(err, sql.ErrNoRows) {
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
	return SelectOne[Owner](`
select *
from owners
where email = $1`, email)
}

func FindOwnerByToken(token string) (*Owner, error) {
	return SelectOne[Owner](`
select o.*
from owners o
         inner join owner_auth_tokens oat on oat.owner_id = o.id
where oat.token = $1`, token)
}

func FindAllOwners() ([]Owner, error) {
	return Select[Owner](`
select *
from owners
order by name`)
}

func FindAllAdmins() ([]Owner, error) {
	return Select[Owner](`
select *
from owners
where is_admin = true
order by name`)
}

func CreateOwnerEncryptionKeyIfNotExists(owner *Owner) (*OwnerEncryptionKey, error) {
	encryptionKey, err := FindOwnerEncryptionKeyByOwner(owner)
	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		return nil, err
	} else if err == nil {
		return encryptionKey, nil
	}

	ownerKey, err := encryption.CreateOwnerKey()
	if err != nil {
		return nil, err
	}

	encryptionKey = &OwnerEncryptionKey{
		OwnerId:      owner.Id,
		EncryptedKey: ownerKey,
	}

	err = GetDbMap().Insert(encryptionKey)
	if err != nil {
		return nil, err
	}

	return encryptionKey, nil
}

func FindOwnerEncryptionKeyByOwner(owner *Owner) (*OwnerEncryptionKey, error) {
	return SelectOne[OwnerEncryptionKey](`
select *
from owner_encryption_key
where owner_id = $1`, owner.Id)
}
