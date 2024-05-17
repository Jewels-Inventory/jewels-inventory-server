import { Type } from '$lib/database/models';

export function stringToDeviceType(type: string | undefined | null) {
	switch (type) {
		case 'computer':
			return Type.Computer;
		case 'other':
			return Type.Other;
		case 'watches':
			return Type.Smartwatch;
		default:
			return Type.PhoneOrTablet;
	}
}
