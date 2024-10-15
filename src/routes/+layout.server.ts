import { getOwnerByEmail } from '$lib/database/client';
import { redirect } from '@sveltejs/kit';

export async function load(event) {
	const session = await event.locals.auth();
	if (!session && event.route.id !== '/signin') {
		throw redirect(302, '/signin');
	}
	if (session && event.route.id === '/signin') {
		throw redirect(302, `/`);
	}

	const owner = await getOwnerByEmail(session?.user?.email as string);

	return {
		owner,
		session
	};
}
