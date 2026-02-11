package database

import (
	"encoding/json"
	"errors"
	"jewels/encryption"
)

func FindMyOneTimePasswords(owner *Owner) ([]OneTimePasswordWithShare, error) {
	data, err := dbMap.SelectStr(`
select coalesce(jsonb_agg(
                        (jsonb_build_object(
                                'id', otp.id,
                                'ownerId', otp.owner_id,
                                'accountName', otp.account_name,
                                'accountIssuer', otp.account_issuer,
                                'encryptedSecretKey', encode(otp.secret_key::bytea, 'base64'),
							    'brandIcon', bi.reference,
							    'brandIconSimilarity', coalesce(bi.score, 0),
							    'simpleIcon', si.slug,
							    'simpleIconSimilarity', coalesce(si.score, 0),
                                'sharedWith', coalesce(
                                        (select json_agg(
                                                        jsonb_build_object(
                                                                'id', o.id,
                                                                'name', o.name,
                                                                'email', o.email,
                                                                'isAdmin', o.is_admin,
                                                                'profilePicture', o.profile_picture
                                                        )
                                                )
                                         from one_time_password_shares otps
                                                  join owners o
                                                       on o.id = otps.shared_to_owner_id
                                         where otps.one_time_password_id = otp.id),
                                        '[]'::json
                                              )
                         )) order by account_issuer, account_issuer
                ), '[]')
from one_time_passwords otp
         left join lateral ( select *, similarity(bi.name, otp.account_issuer) as score
                             from brand_icons bi
                             where bi.name % otp.account_issuer
                             order by score desc
                             limit 1 ) bi on true
         left join lateral ( select *, similarity(si.title, otp.account_issuer) as score
                             from simple_icons si
                             where si.title % otp.account_issuer
                             order by score desc
                             limit 1 ) si on true
where otp.owner_id = $1`, owner.Id)
	if err != nil {
		return nil, err
	}

	var otps []OneTimePasswordWithShare
	err = json.Unmarshal([]byte(data), &otps)
	if err != nil {
		return nil, err
	}

	ownerKey, err := FindOwnerEncryptionKeyByOwner(owner)
	if err != nil {
		return nil, err
	}

	encryptedSecrets := make([][]byte, len(otps))
	for i, otp := range otps {
		encryptedSecrets[i] = otp.EncryptedSecretKey
	}

	decryptedSecrets, err := encryption.DecryptOwnerList(encryptedSecrets, ownerKey.EncryptedKey)
	if err != nil {
		return nil, err
	}

	for i, _ := range otps {
		otps[i].SecretKey = decryptedSecrets[i]
		otps[i].EncryptedSecretKey = nil
		otps[i].CanEdit = true
	}

	return otps, nil
}

func FindSharedOneTimePasswords(owner *Owner) ([]SharedOneTimePassword, error) {
	type sharedOneTimePassword struct {
		OneTimePasswordWithIcon
		SharedToOwnerId int64 `db:"shared_to_owner_id"`
	}

	sharedOtps, err := Select[sharedOneTimePassword](`
select otp.*,
       otps.shared_to_owner_id,
       coalesce(bi.reference, '') as brand_icon,
       coalesce(si.slug, '')      as simple_icon,
       coalesce(bi.score, 0)      as brand_icon_similarity,
	   coalesce(si.score, 0)      as simple_icon_similarity
from one_time_passwords otp
         join one_time_password_shares otps on otps.one_time_password_id = otp.id
         left join lateral ( select *, similarity(bi.name, otp.account_issuer) as score
                             from brand_icons bi
                             where bi.name % otp.account_issuer
                             order by score desc
                             limit 1 ) bi on true
         left join lateral ( select *, similarity(si.title, otp.account_issuer) as score
                             from simple_icons si
                             where si.title % otp.account_issuer
                             order by score desc
                             limit 1 ) si on true
where otps.shared_to_owner_id = $1
order by otp.account_issuer, otp.account_name`, owner.Id)
	if err != nil {
		return nil, err
	}

	groupedOtps := make(map[int64][]SharedOneTimePassword)
	for _, otp := range sharedOtps {
		group := groupedOtps[otp.OwnerId]
		groupedOtps[otp.OwnerId] = append(group, SharedOneTimePassword{
			OneTimePasswordWithIcon: otp.OneTimePasswordWithIcon,
			SharedBy:                nil,
		})
	}

	otps := make([]SharedOneTimePassword, 0)

	for ownerId, groupedOtp := range groupedOtps {
		o, err := FindOwnerById(ownerId)
		if err != nil {
			return nil, err
		}

		ownerKey, err := FindOwnerEncryptionKeyByOwner(o)
		if err != nil {
			return nil, err
		}

		encryptedSecrets := make([][]byte, len(groupedOtp))
		for i, otp := range groupedOtp {
			encryptedSecrets[i] = otp.EncryptedSecretKey
		}

		decryptedSecrets, err := encryption.DecryptOwnerList(encryptedSecrets, ownerKey.EncryptedKey)
		if err != nil {
			return nil, err
		}

		for i, otp := range groupedOtp {
			otp.SecretKey = decryptedSecrets[i]
			otp.CanEdit = false
			otp.EncryptedSecretKey = nil
			otp.SharedBy = o
			otps = append(otps, otp)
		}
	}

	return otps, nil
}

func FindOneTimePassword(owner *Owner, otpId int64) (*OneTimePassword, error) {
	otp, err := SelectOne[OneTimePassword](`
select *
from one_time_passwords
where id = $1
  and owner_id = $2`, otpId, owner.Id)
	if err != nil {
		return nil, err
	}

	ownerKey, err := FindOwnerEncryptionKeyByOwner(owner)
	if err != nil {
		return nil, err
	}

	otp.SecretKey, err = encryption.DecryptOwnerString(otp.EncryptedSecretKey, ownerKey.EncryptedKey)
	if err != nil {
		return nil, err
	}

	return otp, nil
}

func CreateOneTimePassword(owner *Owner, otp *OneTimePassword) error {
	encryptionKey, err := FindOwnerEncryptionKeyByOwner(owner)
	if err != nil {
		return err
	}

	encryptedSecretKey, err := encryption.EncryptOwnerString(otp.SecretKey, encryptionKey.EncryptedKey)
	if err != nil {
		return err
	}

	otp.EncryptedSecretKey = []byte(encryptedSecretKey)

	err = dbMap.Insert(otp)
	if err != nil {
		return err
	}

	otp.EncryptedSecretKey = nil

	return nil
}

func UpdateOneTimePassword(owner *Owner, otp *OneTimePassword) error {
	_, err := dbMap.Exec(`
update one_time_passwords
set account_name   = coalesce($1, account_name)
where id = $2
  and owner_id = $3`, otp.AccountName, otp.Id, owner.Id)

	return err
}

func DeleteOneTimePassword(owner *Owner, otpId int64) error {
	_, err := dbMap.Exec(`
delete
from one_time_passwords
where id = $1
  and owner_id = $2`, otpId, owner.Id)

	return err
}

func ShareOneTimePassword(owner *Owner, sharedTo, otpId int64) error {
	if owner.Id == sharedTo {
		return errors.New("cannot share with yourself")
	}

	otp, err := FindOneTimePassword(owner, otpId)
	if err != nil {
		return err
	}

	return dbMap.Insert(&OneTimePasswordShare{
		OneTimePasswordId: otp.Id,
		SharedToOwnerId:   sharedTo,
	})
}

func UnshareOneTimePassword(owner *Owner, sharedTo, otpId int64) error {
	_, err := dbMap.Exec(`
delete
from one_time_password_shares otps
    using one_time_passwords otp
where otps.one_time_password_id = $1
  and otps.shared_to_owner_id = $2
  and otps.one_time_password_id = otp.id
  and otp.owner_id = $3`, otpId, sharedTo, owner.Id)
	return err
}

func UpdateOneTimePasswordShares(owner *Owner, sharedTo []int64, otpId int64) error {
	otp, err := FindOneTimePassword(owner, otpId)
	if err != nil {
		return err
	}

	tx, err := dbMap.Begin()
	if err != nil {
		return err
	}

	defer tx.Rollback()

	_, err = tx.Exec(`
delete
from one_time_password_shares otps
using one_time_passwords otp
where otps.one_time_password_id = $1
  and otps.one_time_password_id = otp.id
  and otp.owner_id = $2`, otpId, owner.Id)
	if err != nil {
		return err
	}

	for _, sharedToId := range sharedTo {
		if sharedToId != owner.Id {
			_, err = tx.Exec(`
insert into one_time_password_shares (one_time_password_id, shared_to_owner_id)
values ($1, $2)`, otp.Id, sharedToId)
			if err != nil {
				return err
			}
		}
	}

	return tx.Commit()
}
