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
	Id             string   `json:"id" bson:"_id"`
	Name           string   `json:"name"`
	Email          string   `json:"email"`
	Tokens         []string `json:"-" bson:"tokens"`
	Roles          []string `json:"roles"`
	ProfilePicture *string  `json:"profilePicture,omitempty"`
}

type Drive struct {
	Name         string  `json:"name"`
	Manufacturer string  `json:"manufacturer"`
	Model        string  `json:"model"`
	Size         float64 `json:"size"`
}

type Cpu struct {
	Manufacturer string  `json:"manufacturer"`
	Model        string  `json:"model"`
	Speed        float64 `json:"speed"`
	Cores        float64 `json:"cores"`
	Threads      float64 `json:"threads"`
}

type Bios struct {
	Manufacturer string `json:"manufacturer"`
	Version      string `json:"version"`
}

type Mainboard struct {
	Manufacturer string `json:"manufacturer"`
	Version      string `json:"version"`
	Model        string `json:"model"`
}

type Kernel struct {
	Version      string `json:"version"`
	Architecture string `json:"architecture"`
}

type OperatingSystem struct {
	Version *string `json:"version"`
	Name    string  `json:"name"`
}

type Device struct {
	Id           string           `json:"id" bson:"_id"`
	OwnerId      string           `json:"-" bson:"ownerId"`
	Type         DeviceType       `json:"type"`
	Hostname     *string          `json:"hostname,omitempty"`
	Model        string           `json:"model"`
	Manufacturer string           `json:"manufacturer"`
	Os           *OperatingSystem `json:"os,omitempty"`
	Storage      *float64         `json:"storage,omitempty"`
	Ram          *float64         `json:"ram,omitempty"`
	Eol          *time.Time       `json:"eol,omitempty"`
	Cpu          *Cpu             `json:"cpu,omitempty"`
	Bios         *Bios            `json:"bios,omitempty"`
	Mainboard    *Mainboard       `json:"mainboard,omitempty"`
	Kernel       *Kernel          `json:"kernel,omitempty"`
	Drives       []Drive          `json:"drives,omitempty"`
	Notes        string           `json:"notes,omitempty"`
}
