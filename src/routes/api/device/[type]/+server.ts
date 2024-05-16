import { json } from '@sveltejs/kit';
import { getOwnerByToken, updateOwner } from '$lib/database/client';
import { type Device, Type } from '$lib/database/models';

export async function POST({ request, params }) {
	const body = (await request.json()) as Device;

	const authorizationHeader = request.headers.get('Authorization');
	if (!authorizationHeader) {
		return json(
			{
				message: 'Authorization header is missing'
			},
			{
				status: 401
			}
		);
	}

	const token = authorizationHeader.split(' ')[1];
	const owner = await getOwnerByToken(token);
	if (!owner) {
		return json(
			{
				message: 'Not authorized'
			},
			{
				status: 404
			}
		);
	}

	if (typeof body.eol === 'string') {
		body.eol = new Date(Date.parse(body.eol as string));
	}
	switch (params.type) {
		case 'phone':
			body.type = Type.PhoneOrTablet;
			break;
		case 'computer':
			body.type = Type.Computer;
			break;
		case 'watch':
			body.type = Type.Smartwatch;
			break;
		case 'other':
			body.type = Type.Other;
			break;
	}

	const device = owner.devices.findIndex((d) => d.id === body.id);
	if (device === -1) {
		owner.devices.push(body);
	} else {
		owner.devices.splice(device, 1, body);
	}

	await updateOwner(owner);

	return new Response(null, { status: 204 });
}
