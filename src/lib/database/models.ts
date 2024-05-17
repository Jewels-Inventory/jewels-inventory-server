import type { ObjectId } from 'mongodb';

export type Session = {
	expires: Date;
	sessionToken: string;
};

export type Owner = {
	_id?: string | ObjectId;
	oidcId?: string;
	name: string;
	email: string;
	devices: Device[];
	tokens: string[];
	roles: string[];
	sessions: Session[];
	profilePicture?: string;
};

export type Drive = {
	name: string;
	driver: string;
	manufacturer: string;
	model: string;
	size: number;
};

export type Cpu = {
	manufacturer: string;
	model: string;
	speed: number;
	cores: number;
	threads: number;
};

export type Bios = {
	manufacturer: string;
	version: string;
};

export type Mainboard = {
	manufacturer: string;
	version: string;
	model: string;
	serial: string;
};

export type Kernel = {
	release: string;
	version: string;
	architecture: string;
};

export type OperatingSystem = {
	version: string | null;
	name: string;
};

export enum Type {
	PhoneOrTablet = 'phone',
	Computer = 'computer',
	Smartwatch = 'watch',
	Other = 'other'
}

export type Device = {
	id: string;
	type: Type;
	hostname?: string;
	model: string;
	manufacturer: string;
	os?: OperatingSystem;
	storage?: number;
	ram?: number;
	eol?: Date | string | null;
	cpu?: Cpu;
	bios?: Bios;
	mainboard?: Mainboard;
	kernel?: Kernel;
	drives?: Drive[];
};
