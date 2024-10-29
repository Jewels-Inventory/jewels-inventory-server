import { getOwnerByEmail } from '$lib/database/client';
import { redirect } from '@sveltejs/kit';
import type { Owner } from '$lib/database/models';

export async function load(event) {
	const { auth } = event.locals;
	if (event.route.id === '/signin') {
		return { owner: {}, loggedIn: false };
	}

	const session = await auth();
	if (!session) {
		throw redirect(302, '/signin');
	}

	const owner = (await getOwnerByEmail(session?.user?.email as string)) as Owner;

	return {
		owner,
		loggedIn: !!session
	};
}
