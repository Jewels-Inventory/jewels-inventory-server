import { getOwnerByEmail } from '$lib/database/client';

export async function load(event) {
	const session = await event.locals.auth();
	const owner = await getOwnerByEmail(session?.user?.email as string);

	return {
		owner,
		session
	};
}
