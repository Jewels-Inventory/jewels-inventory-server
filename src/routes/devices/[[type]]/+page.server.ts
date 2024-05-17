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
	deleteDevice({ request, route, locals }) {
		return deleteDevice(request, locals, route.id);
	},
	createDevice({ request, route, locals, params }) {
		return createDevice(request, params.type as Type, route, locals);
	},
	editDevice({ request, route, locals }) {
		return editDevice(request, route, locals);
	}
};
