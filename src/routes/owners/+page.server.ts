import { getOwner, getOwnerByEmail, getOwners, updateOwner } from '$lib/database/client';
import { redirect } from '@sveltejs/kit';

export async function load(event) {
	const session = await event.locals.auth();
	const owner = await getOwnerByEmail(session?.user?.email as string);
	if (!owner?.roles?.includes('admin')) {
		throw redirect(302, '/devices/phones');
	}

	const owners = await getOwners();

	return {
		owners
	};
}

export const actions = {
	async createToken({ request }) {
		const formData = await request.formData();
		const token = formData.get('token') as string;
		const ownerId = formData.get('ownerId') as string;

		const owner = await getOwner(ownerId);
		if (!owner) {
			return {
				createSuccess: false
			};
		}

		owner.tokens.push(token);

		await updateOwner(owner);

		return {
			createSuccess: true
		};
	}
};
