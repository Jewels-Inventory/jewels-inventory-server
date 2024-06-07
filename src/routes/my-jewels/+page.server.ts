import { getOwnerByEmail, updateOwner } from '$lib/database/client';
import type { Session, User } from '@auth/sveltekit';
import { type Device, type Owner, Type } from '$lib/database/models';
import { createDevice, deleteDevice, editDevice } from '$lib/devicePageHelper';

export async function load({ locals }) {
	const session = (await locals.auth()) as Session;
	const { email } = session.user as User;
	const me = (await getOwnerByEmail(email as string)) as Owner;
	const devices: Device[] = me.devices;

	return {
		me,
		devices
	};
}

export const actions = {
	deleteDevice({ request, route, locals }) {
		return deleteDevice(request, locals, route.id);
	},
	async editDevice({ request, route, locals }) {
		return await editDevice(await request.formData(), route, locals);
	},
	async createDevice({ request, route, locals }) {
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
			const type = formData.get('deviceType') as Type;

			return await createDevice(formData, type, route, locals);
		}
	}
};
