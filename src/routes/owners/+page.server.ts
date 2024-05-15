import { createOwner, deleteOwner, getOwner, getOwners, updateOwner } from '$lib/database/client';

export async function load() {
	const owners = await getOwners();

	return {
		owners
	};
}

export const actions = {
	async deleteOwner({ request }) {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		await deleteOwner(id);

		return { deleteSuccess: true };
	},
	async createOwner({ request }) {
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const email = formData.get('email') as string;

		await createOwner({
			name,
			email,
			tokens: [],
			devices: []
		});

		return {
			newSuccess: true
		};
	},
	async editOwner({ request }) {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		const name = formData.get('name') as string;
		const email = formData.get('email') as string;

		const owner = await getOwner(id);
		if (!owner) {
			return {
				editSuccess: false
			};
		}

		owner.name = name;
		owner.email = email;

		await updateOwner(owner);

		return {
			editSuccess: true
		};
	},
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
