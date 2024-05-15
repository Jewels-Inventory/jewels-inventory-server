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
		const os = formData.get('os.name') as string;
		const osVersion = formData.get('os.version') as string;
		const storage = formData.get('storage') as string;
		const ram = formData.get('ram') as string;
		const eol = Date.parse(formData.get('eol') as string);
		const ownerId = formData.get('owner') as string;

		const owner = await getOwner(ownerId);
		if (!owner) {
			return {
				newSuccess: false
			};
		}

		const device: Device = {
			eol: isNaN(eol) ? null : new Date(eol),
			id: crypto.randomUUID(),
			manufacturer,
			model,
			os: {
				name: os,
				version: osVersion
			},
			ram: parseInt(ram, 10),
			storage: parseInt(storage, 10),
			type: Type.Smartwatch
		};
		owner.devices.push(device);

		await updateOwner(owner);

		return {
			newSuccess: true
		};
	},
	async editDevice({ request }) {
		const formData = await request.formData();
		const deviceId = formData.get('id') as string;
		const model = formData.get('model') as string;
		const manufacturer = formData.get('manufacturer') as string;
		const os = formData.get('os.name') as string;
		const osVersion = formData.get('os.version') as string;
		const storage = formData.get('storage') as string;
		const ram = formData.get('ram') as string;
		const eol = Date.parse(formData.get('eol') as string);
		const ownerId = formData.get('owner') as string;

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

		device.eol = isNaN(eol) ? null : new Date(eol);
		device.id = crypto.randomUUID();
		device.manufacturer = manufacturer;
		device.model = model;
		if (device.os) {
			device.os = {
				name: os,
				version: osVersion
			};
		}
		device.ram = parseInt(ram, 10);
		device.storage = parseInt(storage, 10);

		await updateOwner(owner);

		return {
			editSuccess: true
		};
	}
};
