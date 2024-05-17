import { getOwners } from '$lib/database/client';
import { createDevice, deleteDevice, editDevice } from '$lib/devicePageHelper';
import { stringToDeviceType } from '$lib/helper';

export async function load({ params }) {
	const owners = await getOwners();

	return {
		owners,
		deviceType: stringToDeviceType(params.type)
	};
}

export const actions = {
	deleteDevice({ request }) {
		return deleteDevice(request);
	},
	createDevice({ request, route, locals, params }) {
		return createDevice(request, stringToDeviceType(params.type), route, locals);
	},
	editDevice({ request, route, locals }) {
		return editDevice(request, route, locals);
	}
};
