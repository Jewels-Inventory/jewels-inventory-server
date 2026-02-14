package database

import (
	"time"
)

type DeviceType string

const (
	PhoneOrTablet DeviceType = "phone"
	Computer      DeviceType = "computer"
	Smartwatch    DeviceType = "watch"
	Other         DeviceType = "other"
)

type Owner struct {
	Id             int64   `json:"id" db:"id,autoincrement,primarykey"`
	Name           string  `json:"name" db:"name,unique"`
	Email          string  `json:"email" db:"email,unique"`
	IsAdmin        bool    `json:"isAdmin" db:"is_admin"`
	ProfilePicture *string `json:"profilePicture,omitempty" db:"profile_picture"`
}

type OwnerAuthToken struct {
	Id      int64  `json:"-" db:"id,autoincrement,primarykey"`
	OwnerId int64  `json:"-" db:"owner_id"`
	Token   string `json:"token" db:"token"`
}

type Drive struct {
	Id           int64   `json:"-" db:"id,autoincrement,primarykey"`
	Name         string  `json:"name" db:"name"`
	Manufacturer string  `json:"manufacturer" db:"manufacturer"`
	Model        string  `json:"model" db:"model"`
	Size         float64 `json:"size" db:"size"`
	DeviceId     int64   `json:"-" db:"device_id"`
}

type Cpu struct {
	Id           int64   `json:"-" db:"id,autoincrement,primarykey"`
	Manufacturer string  `json:"manufacturer" db:"manufacturer"`
	Model        string  `json:"model" db:"model"`
	Speed        float64 `json:"speed" db:"speed"`
	Cores        float64 `json:"cores" db:"cores"`
	Threads      float64 `json:"threads" db:"threads"`
	DeviceId     int64   `json:"-" db:"device_id"`
}

type Bios struct {
	Id           int64  `json:"-" db:"id,autoincrement,primarykey"`
	Manufacturer string `json:"manufacturer" db:"manufacturer"`
	Version      string `json:"version" db:"version"`
	DeviceId     int64  `json:"-" db:"device_id"`
}

type Mainboard struct {
	Id           int64  `json:"-" db:"id,autoincrement,primarykey"`
	Manufacturer string `json:"manufacturer" db:"manufacturer"`
	Version      string `json:"version" db:"version"`
	Model        string `json:"model" db:"model"`
	DeviceId     int64  `json:"-" db:"device_id"`
}

type Kernel struct {
	Id           int64  `json:"-" db:"id,autoincrement,primarykey"`
	Version      string `json:"version" db:"version"`
	Architecture string `json:"architecture" db:"architecture"`
	DeviceId     int64  `json:"-" db:"device_id"`
}

type OperatingSystem struct {
	Id       int64   `json:"-" db:"id,autoincrement,primarykey"`
	Version  *string `json:"version" db:"version"`
	Name     string  `json:"name" db:"name"`
	DeviceId int64   `json:"-" db:"device_id"`
}

type Device struct {
	Id            int64            `json:"-" db:"id,autoincrement,primarykey"`
	DeviceId      string           `json:"id" db:"device_id"`
	OwnerId       int64            `json:"-" db:"owner_id"`
	Type          DeviceType       `json:"type" db:"type"`
	Hostname      *string          `json:"hostname,omitempty" db:"hostname"`
	Model         string           `json:"model" db:"model"`
	Manufacturer  string           `json:"manufacturer" db:"manufacturer"`
	Storage       *float64         `json:"storage,omitempty" db:"storage"`
	Ram           *float64         `json:"ram,omitempty" db:"ram"`
	Eol           *time.Time       `json:"eol,omitempty" db:"eol"`
	Notes         string           `json:"notes,omitempty" db:"notes"`
	Cpu           *Cpu             `json:"cpu,omitempty" db:"-"`
	Bios          *Bios            `json:"bios,omitempty" db:"-"`
	Mainboard     *Mainboard       `json:"mainboard,omitempty" db:"-"`
	Kernel        *Kernel          `json:"kernel,omitempty" db:"-"`
	Drives        []Drive          `json:"drives,omitempty" db:"-"`
	Os            *OperatingSystem `json:"os,omitempty" db:"-"`
	RelayClientId *int64           `json:"-" db:"relay_client_id"`
	RelayServerId *int64           `json:"-" db:"relay_server_id"`
}

type RelayClient struct {
	Id            int64  `json:"id"`
	Name          string `json:"name"`
	RelayServerId int64  `json:"relayServerId"`
	AllocatedIp   string `json:"allocatedIp"`
}

type OwnerEncryptionKey struct {
	OwnerId      int64  `db:"owner_id"`
	EncryptedKey string `db:"encrypted_key"`
}

type OneTimePassword struct {
	Id                 int64  `json:"id" db:"id,autoincrement,primarykey"`
	OwnerId            int64  `json:"-" db:"owner_id"`
	AccountName        string `json:"accountName" db:"account_name"`
	AccountIssuer      string `json:"accountIssuer" db:"account_issuer"`
	EncryptedSecretKey []byte `json:"encryptedSecretKey,omitempty" db:"secret_key"`
	SecretKey          string `json:"secretKey" db:"-"`
	CanEdit            bool   `json:"canEdit" db:"-"`
}

type OneTimePasswordShare struct {
	OneTimePasswordId int64 `db:"one_time_password_id"`
	SharedToOwnerId   int64 `db:"shared_to_owner_id"`
}

type OneTimePasswordWithIcon struct {
	OneTimePassword
	BrandIcon            string  `json:"brandIcon" db:"brand_icon"`
	SimpleIcon           string  `json:"simpleIcon" db:"simple_icon"`
	BrandIconSimilarity  float64 `json:"brandIconSimilarity" db:"brand_icon_similarity"`
	SimpleIconSimilarity float64 `json:"simpleIconSimilarity" db:"simple_icon_similarity"`
}

type OneTimePasswordWithShare struct {
	OneTimePasswordWithIcon
	SharedWith []Owner `json:"sharedWith" db:"-"`
}

type SharedOneTimePassword struct {
	OneTimePasswordWithIcon
	SharedBy *Owner `json:"sharedBy" db:"-"`
}

type BrandIcon struct {
	Name      string `json:"Name" db:"name"`
	Reference string `json:"Reference" db:"reference"`
	SVG       string `json:"SVG" db:"svg"`
	PNG       string `json:"PNG" db:"png"`
	WebP      string `json:"WebP" db:"webp"`
}

type SimpleIcon struct {
	Title string `json:"title" db:"title"`
	Slug  string `json:"slug" db:"slug"`
	Code  string `json:"code" db:"code"`
	Hex   string `json:"hex" db:"hex"`
}

type AndroidDevice struct {
	RetailBranding string `db:"retail_branding"`
	MarketingName  string `db:"marketing_name"`
	Device         string `db:"device"`
	Model          string `db:"model"`
}
