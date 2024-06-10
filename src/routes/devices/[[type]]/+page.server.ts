import { getOwners } from '$lib/database/client';
import { createDevice, deleteDevice, editDevice } from '$lib/devicePageHelper';
import { Type } from '$lib/database/models';

export async function load({ params }) {
	const owners = await getOwners();

	return {
		owners,
		deviceType: params.type ? (params.type as Type) : Type.PhoneOrTablet
	};
}

export const actions = {
	async deleteDevice({ request, route, locals }) {
		return await deleteDevice(await request.formData(), locals, route.id);
	},
	async createDevice({ request, route, locals, params }) {
		return await createDevice(await request.formData(), params.type as Type, route, locals);
	},
	async editDevice({ request, route, locals }) {
		return await editDevice(await request.formData(), route, locals);
	}
};
