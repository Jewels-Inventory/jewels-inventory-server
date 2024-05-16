import { signIn } from '$lib/authentication';
import type { Actions } from './$types';

export const actions: Actions = {
	default: signIn
};
