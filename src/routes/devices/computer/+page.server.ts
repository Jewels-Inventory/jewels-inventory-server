import { getOwner, getOwners, updateOwner } from '$lib/database/client';
import { type Device, Type } from '$lib/database/models';

export async function load() {
	const owners = await getOwners();

	return {
		owners
	};
}

export const actions = {
	async deleteDevice({ request }) {
		const formData = await request.formData();
		const deviceId = formData.get('selectedDevice') as string;
		const ownerId = formData.get('selectedOwner') as string;

		const owner = await getOwner(ownerId);
		if (owner) {
			owner.devices.splice(
				owner.devices.findIndex((device) => device.id === deviceId),
				1
			);

			await updateOwner(owner);
		}

		return { deleteSuccess: true };
	},
	async createDevice({ request }) {
		const formData = await request.formData();
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
		const ownerId = formData.get('ownerId') as string;

		const owner = await getOwner(ownerId);
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
			type: Type.Computer
		};
		owner.devices.push(device);

		await updateOwner(owner);

		return {
			newSuccess: true
		};
	},
	editDevice: async function ({ request }) {
		const formData = await request.formData();
		const deviceId = formData.get('deviceId') as string;
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
		const ownerId = formData.get('ownerId') as string;

		const owner = await getOwner(ownerId);
		if (!owner) {
			return {
				editSuccess: false
			};
		}

		const device = owner.devices.find((d) => d.id === deviceId);
		if (!device) {
			return {
				editSuccess: false
			};
		}

		device.manufacturer = manufacturer;
		device.hostname = hostname;
		device.model = model;
		device.ram = parseInt(ram, 10);
		device.storage = parseInt(storage, 10);

		if (device.os) {
			device.os.name = os;
			device.os.version = osVersion;
		} else {
			device.os = {
				name: os,
				version: osVersion
			};
		}
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

		await updateOwner(owner);

		return {
			editSuccess: true
		};
	}
};
