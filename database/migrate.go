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
		AddTableWithName[OwnerEncryptionKey]("owner_encryption_key")
		AddTableWithName[OneTimePassword]("one_time_passwords")
		AddTableWithName[OneTimePasswordShare]("one_time_password_shares").
			SetUniqueTogether("one_time_password_id", "shared_to_owner_id")
		AddTableWithName[BrandIcon]("brand_icons")
		AddTableWithName[SimpleIcon]("simple_icons")

		err = GetDbMap().CreateTablesIfNotExists()
		if err != nil {
			panic(err)
		}

		// Introduced: JWLS-10
		_, err = conn.Exec(`
create or replace function add_foreign_key_if_not_exists(from_table text, from_column text, to_table text, to_column text)
returns void language plpgsql as
$$
declare 
   fk_exists boolean;
begin
    fk_exists := case when exists (select true
	from information_schema.table_constraints tc
		inner join information_schema.constraint_column_usage ccu
			using (constraint_catalog, constraint_schema, constraint_name)
		inner join information_schema.key_column_usage kcu
			using (constraint_catalog, constraint_schema, constraint_name)
	where constraint_type = 'FOREIGN KEY'
	  and ccu.table_name = to_table
	  and ccu.column_name = to_column
	  and tc.table_name = from_table
	  and kcu.column_name = from_column) then true else false end;
	if not fk_exists then
		execute format('alter table %s add constraint %s_%s_fkey foreign key (%s) references %s(%s) on delete cascade', from_table, from_table, to_table, from_column, to_table, to_column);
	end if;
end
$$;

select add_foreign_key_if_not_exists('owner_auth_tokens', 'owner_id', 'owners', 'id');
select add_foreign_key_if_not_exists('devices', 'owner_id', 'owners', 'id');
select add_foreign_key_if_not_exists('drives', 'device_id', 'devices', 'id');
select add_foreign_key_if_not_exists('bios', 'device_id', 'devices', 'id');
select add_foreign_key_if_not_exists('mainboards', 'device_id', 'devices', 'id');
select add_foreign_key_if_not_exists('kernels', 'device_id', 'devices', 'id');
select add_foreign_key_if_not_exists('operating_systems', 'device_id', 'devices', 'id');
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

		// Introduced: JWLS-15
		_, err = conn.Exec(`
create extension if not exists pg_trgm;

select add_foreign_key_if_not_exists('one_time_passwords', 'owner_id', 'owners', 'id');

select add_foreign_key_if_not_exists('one_time_password_shares', 'shared_to_owner_id', 'owners', 'id');
select add_foreign_key_if_not_exists('one_time_password_shares', 'one_time_password_id', 'one_time_passwords', 'id');
`)
		if err != nil {
			panic(err)
		}
	}
}
