import { getOwner, getOwnerByEmail, updateOwner } from '$lib/database/client';
import { type Device, type Owner, Type } from '$lib/database/models';
import type { Session, User } from '@auth/sveltekit';

async function getFormData<RouteId>(formData: FormData, routeId: RouteId, locals: App.Locals) {
	const model = formData.get('model') as string;
	const manufacturer = formData.get('manufacturer') as string;
	const hostname = formData.get('hostname') as string;
	const os = formData.get('os.name') as string;
	const osVersion = formData.get('os.version') as string;
	const storage = formData.get('storage') as string;
	const ram = formData.get('ram') as string;
	const cpuManufacturer = formData.get('cpu.manufacturer') as string;
	const cpuModel = formData.get('cpu.model') as string;
	const cpuSpeed = formData.get('cpu.speed') as string;
	const cores = formData.get('cpu.cores') as string;
	const threads = formData.get('cpu.threads') as string;
	const eol = Date.parse(formData.get('eol') as string);
	let owner: Owner | null;
	if (routeId === '/my-jewels') {
		const session = (await locals.auth()) as Session;
		const user = session.user as User;
		owner = await getOwnerByEmail(user.email as string);
	} else {
		const ownerId = formData.get('ownerId') as string;
		owner = await getOwner(ownerId);
	}

	return {
		model,
		manufacturer,
		hostname,
		os,
		osVersion,
		storage,
		ram,
		cpuManufacturer,
		cpuModel,
		cpuSpeed,
		cores,
		threads,
		eol,
		owner
	};
}

export async function deleteDevice(formData: FormData, locals: App.Locals, routeId: string) {
	const deviceId = formData.get('selectedDevice') as string;

	let owner: Owner | null;
	if (routeId === '/my-jewels') {
		const session = (await locals.auth()) as Session;
		const user = session.user as User;
		owner = await getOwnerByEmail(user.email as string);
	} else {
		const ownerId = formData.get('selectedOwner') as string;
		owner = await getOwner(ownerId);
	}

	if (owner) {
		owner.devices.splice(
			owner.devices.findIndex((device) => device.id === deviceId),
			1
		);

		await updateOwner(owner);
	}

	return { deleteSuccess: true };
}

export async function createDevice(
	formData: FormData,
	type: Type,
	route: {
		id: string;
	},
	locals: App.Locals
) {
	const {
		model,
		manufacturer,
		hostname,
		os,
		osVersion,
		storage,
		ram,
		cpuManufacturer,
		cpuModel,
		cpuSpeed,
		cores,
		threads,
		eol,
		owner
	} = await getFormData(formData, route.id, locals);

	if (!owner) {
		return {
			newSuccess: false
		};
	}

	const device: Device = {
		hostname,
		id: crypto.randomUUID(),
		manufacturer,
		model,
		eol: isNaN(eol) ? null : new Date(eol),
		os: {
			name: os,
			version: osVersion
		},
		cpu: {
			manufacturer: cpuManufacturer,
			model: cpuModel,
			speed: parseInt(cpuSpeed, 10),
			cores: parseInt(cores, 10),
			threads: parseInt(threads, 10)
		},
		ram: parseInt(ram, 10),
		storage: parseInt(storage, 10),
		type
	};
	owner.devices.push(device);

	await updateOwner(owner);

	return {
		newSuccess: true
	};
}

export async function editDevice(formData: FormData, route: { id: string }, locals: App.Locals) {
	const {
		model,
		manufacturer,
		hostname,
		os,
		osVersion,
		storage,
		ram,
		cpuManufacturer,
		cpuModel,
		cpuSpeed,
		cores,
		threads,
		eol,
		owner
	} = await getFormData(formData, route.id, locals);
	const deviceId = formData.get('deviceId') as string;

	if (!owner) {
		return {
			newSuccess: false
		};
	}

	const device = owner.devices.find((d) => d.id === deviceId);
	if (!device) {
		return {
			editSuccess: false
		};
	}

	device.manufacturer ??= manufacturer;
	device.hostname ??= hostname;
	device.model ??= model;
	device.ram ??= parseInt(ram, 10);
	device.storage ??= parseInt(storage, 10);
	device.eol ??= isNaN(eol) ? null : new Date(eol);

	if (device.os) {
		device.os.name = os;
		device.os.version = osVersion;
	} else {
		device.os = {
			name: os,
			version: osVersion
		};
	}
	if (device.type === Type.Computer) {
		if (device.cpu) {
			device.cpu.threads = parseInt(threads, 10);
			device.cpu.cores = parseInt(cores, 10);
			device.cpu.model = cpuModel;
			device.cpu.speed = parseInt(cpuSpeed, 10);
			device.cpu.manufacturer = cpuManufacturer;
		} else {
			device.cpu = {
				manufacturer: cpuManufacturer,
				model: cpuModel,
				speed: parseInt(cpuSpeed, 10),
				cores: parseInt(cores, 10),
				threads: parseInt(threads, 10)
			};
		}
	}

	await updateOwner(owner);

	return {
		editSuccess: true
	};
}
