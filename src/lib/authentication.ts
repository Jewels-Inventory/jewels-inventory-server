import { SvelteKitAuth } from '@auth/sveltekit';
import { env } from '$env/dynamic/private';
import type { Adapter, AdapterAccount, AdapterSession, AdapterUser } from '@auth/core/adapters';
import {
	createOwner,
	createSession,
	deleteSession,
	getOwnerByEmail,
	getOwnerByOidcId,
	getOwnerBySession,
	updateOwner
} from '$lib/database/client';
import ZITADEL, { type ZitadelProfile } from '@auth/core/providers/zitadel';

function parseJwt(token: string) {
	const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
	const jsonPayload = decodeURIComponent(
		atob(base64)
			.split('')
			.map(function (c) {
				return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
			})
			.join('')
	);

	return JSON.parse(jsonPayload);
}

const JewelsAdapter: Adapter = {
	async createUser(user: any) {
		const profilePicture = user.picture;

		const { id, name, email, roles } = user;
		const owner = await getOwnerByEmail(email);
		if (owner) {
			owner.name = name as string;
			owner.oidcId = id;
			owner.email = email;
			owner.roles = roles;
			owner.profilePicture = profilePicture;

			await updateOwner(owner);
		} else {
			await createOwner({
				oidcId: id,
				name: name as string,
				email: email,
				tokens: [],
				devices: [],
				sessions: [],
				roles,
				profilePicture
			});
		}

		return {
			emailVerified: new Date(),
			image: undefined,
			name,
			email,
			roles: owner?.roles,
			id
		};
	},
	async getUser(id) {
		const owner = await getOwnerByOidcId(id);
		if (!owner) {
			return null;
		}

		return {
			id,
			email: owner.email as string,
			name: owner.name as string,
			image: owner.profilePicture as string,
			emailVerified: new Date()
		};
	},
	async getUserByEmail(email) {
		const owner = await getOwnerByEmail(email);
		if (!owner) {
			return null;
		}

		return {
			id: owner.oidcId as string,
			email: owner.email as string,
			name: owner.name as string,
			image: owner.profilePicture as string,
			emailVerified: new Date()
		};
	},
	// @ts-expect-error Not needed
	getUserByAccount() {},
	async updateUser(user: any): Promise<AdapterUser> {
		const profilePicture = (user as ZitadelProfile).picture;

		const { id, name, email, roles } = user;
		const owner = await getOwnerByOidcId(user.id);
		if (owner) {
			owner.name = name as string;
			owner.email = email as string;
			owner.oidcId = id;
			owner.profilePicture = profilePicture;
			owner.roles = roles;

			await updateOwner(owner);
		} else {
			await createOwner({
				oidcId: id,
				name: name as string,
				email: email as string,
				tokens: [],
				devices: [],
				sessions: [],
				roles,
				profilePicture
			});
		}

		return {
			emailVerified: new Date(),
			image: undefined,
			name: owner?.name,
			email: owner?.email as string,
			id: owner?._id as string
		};
	},
	async linkAccount(account): Promise<AdapterAccount> {
		const profile = parseJwt(account.id_token as string) as ZitadelProfile;
		const profilePicture = profile.picture;
		const { name, email, roles } = profile;
		const owner = await getOwnerByEmail(email);
		if (owner) {
			owner.name = name as string;
			owner.oidcId = profile.sub;
			owner.email = email;
			owner.profilePicture = profilePicture;
			owner.roles = roles;

			await updateOwner(owner);
		}

		return account;
	},
	async createSession({ sessionToken, userId, expires }): Promise<AdapterSession> {
		await createSession(sessionToken, userId, expires);

		return {
			sessionToken,
			userId,
			expires
		};
	},
	async getSessionAndUser(sessionToken) {
		const owner = await getOwnerBySession(sessionToken);
		if (!owner?.sessions) {
			return null;
		}

		const session = owner.sessions.find((s) => s.sessionToken === sessionToken);
		if (!session) {
			return null;
		}

		return {
			user: {
				id: owner._id as string,
				email: owner.email as string,
				name: owner.name as string,
				image: owner.profilePicture as string,
				emailVerified: new Date()
			},
			session: {
				sessionToken,
				userId: owner._id as string,
				expires: session.expires
			}
		};
	},
	async updateSession({ sessionToken, expires }): Promise<AdapterSession | null> {
		const owner = await getOwnerBySession(sessionToken);
		if (expires && owner?.sessions) {
			owner.sessions[owner.sessions.findIndex((s) => s.sessionToken === sessionToken)].expires =
				expires;
			await updateOwner(owner);

			return {
				sessionToken,
				userId: owner._id as string,
				expires: expires
			};
		}

		return null;
	},
	async deleteSession(sessionToken) {
		await deleteSession(sessionToken);
	}
};

export const { handle, signIn } = SvelteKitAuth({
	adapter: JewelsAdapter,
	trustHost: true,
	providers: [
		ZITADEL({
			issuer: env.AUTH_ISSUER,
			clientId: env.AUTH_CLIENT_ID,
			clientSecret: env.AUTH_CLIENT_SECRET,
			allowDangerousEmailAccountLinking: true
		})
	],
	secret: env.AUTH_SECRET
});
