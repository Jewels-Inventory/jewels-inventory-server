import { handle as handleAuthentication } from '$lib/authentication';

export function handle(input) {
	if (input.event.route.id === '/api/device/[type]' || input.event.route.id === '/signin') {
		return input.resolve(input.event);
	}

	return handleAuthentication(input);
}
