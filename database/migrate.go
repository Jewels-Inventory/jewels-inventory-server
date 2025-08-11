package database

import (
	"context"
	"os"

	"github.com/DerKnerd/gorp"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jackc/pgx/v5/stdlib"
)

var dbMap *gorp.DbMap

func GetDbMap() *gorp.DbMap {
	return dbMap
}

func SetupDatabase() {
	if dbMap == nil {
		pool, err := pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
		if err != nil {
			panic(err)
		}

		conn := stdlib.OpenDBFromPool(pool)

		dialect := gorp.PostgresDialect{}

		dbMap = &gorp.DbMap{Db: conn, Dialect: dialect}

		AddTableWithName[Owner]("owners")
		AddTableWithName[OwnerAuthToken]("owner_auth_tokens")
		AddTableWithName[Drive]("drives")
		AddTableWithName[Cpu]("cpus")
		AddTableWithName[Bios]("bios")
		AddTableWithName[Mainboard]("mainboards")
		AddTableWithName[Kernel]("kernels")
		AddTableWithName[OperatingSystem]("operating_systems")
		AddTableWithName[Device]("devices")

		err = GetDbMap().CreateTablesIfNotExists()
		if err != nil {
			panic(err)
		}

		// Introduced: JWLS-6
		_, err = conn.Exec(`
alter table owner_auth_tokens
	drop constraint if exists owner_auth_tokens_owners_fkey;

alter table drives
	drop constraint if exists drives_device_fkey;

alter table cpus
	drop constraint if exists cpus_device_fkey;

alter table bios
	drop constraint if exists bios_device_fkey;

alter table mainboards
	drop constraint if exists mainboards_device_fkey;

alter table kernels
	drop constraint if exists kernels_device_fkey;

alter table operating_systems
	drop constraint if exists operating_systems_device_fkey;

alter table devices
	drop constraint if exists devices_owner_fkey;

alter table owner_auth_tokens
	add constraint owner_auth_tokens_owners_fkey foreign key (owner_id) references owners(id) on delete cascade;

alter table drives
	add constraint drives_device_fkey foreign key (device_id) references devices(id) on delete cascade;

alter table bios
	add constraint bios_device_fkey foreign key (device_id) references devices(id) on delete cascade;

alter table mainboards
	add constraint mainboards_device_fkey foreign key (device_id) references devices(id) on delete cascade;

alter table kernels
	add constraint kernels_device_fkey foreign key (device_id) references devices(id) on delete cascade;

alter table operating_systems
	add constraint operating_systems_device_fkey foreign key (device_id) references devices(id) on delete cascade;

alter table devices
	add constraint devices_owner_fkey foreign key (owner_id) references owners(id) on delete cascade;
`)
		if err != nil {
			panic(err)
		}

		// Introduced: JWLS-3
		_, err = conn.Exec(`
alter table devices
	add column if not exists relay_server_id bigint null;
alter table devices
	add column if not exists relay_client_id bigint null;
`)
		if err != nil {
			panic(err)
		}

	}
}
