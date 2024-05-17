import { getOwner, getOwnerByEmail, updateOwner } from '$lib/database/client';
import type { Session, User } from '@auth/sveltekit';
import { stringToDeviceType } from '$lib/helper';
import { type Device, type Owner, Type } from '$lib/database/models';
import { createDevice, deleteDevice, editDevice } from '$lib/devicePageHelper';

export async function load({ locals, params }) {
	const session = (await locals.auth()) as Session;
	const { email } = session.user as User;
	const me = (await getOwnerByEmail(email as string)) as Owner;
	const deviceType = params.type ? stringToDeviceType(params.type) : '-1';
	let devices: Device[] = me.devices;
	if (deviceType !== '-1') {
		devices = devices.filter((d) => d.type === deviceType);
	}

	return {
		me,
		deviceType,
		devices
	};
}

export const actions = {
	deleteDevice({ request }) {
		return deleteDevice(request);
	},
	editDevice({ request, route, locals }) {
		return editDevice(request, route, locals);
	},
	async createDevice({ request, params, route, locals }) {
		const formData = await request.formData();
		const registerType = formData.get('registryType') as string;
		if (registerType === 'code') {
			const session = (await locals.auth()) as Session;
			const { email } = session.user as User;
			const owner = (await getOwnerByEmail(email as string)) as Owner;

			const token = formData.get('token') as string;

			if (!owner) {
				return {
					newSuccess: false
				};
			}

			owner.tokens.push(token);

			await updateOwner(owner);

			return {
				newSuccess: true
			};
		} else {
			const type = formData.get('type') as Type;

			return await createDevice(request, type, route, locals);
		}
	}
};
