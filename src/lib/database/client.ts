import type { Owner, Server } from './models';
import { Collection, MongoClient, ObjectId } from 'mongodb';

async function executeInOwners<T>(cb: (collection: Collection<Owner>) => Promise<T>) {
	const client = new MongoClient(process.env.MONGO_URI as string);
	try {
		const db = client.db(process.env.MONGO_DATABASE);
		const collection = db.collection<Owner>('owners');

		return await cb(collection);
	} finally {
		await client.close();
	}
}

export async function getOwners() {
	return await executeInOwners(async (collection) => {
		const owners = await collection.find().toArray();

		return owners.map((owner) => ({
			...owner,
			_id: (owner._id as ObjectId)?.toHexString()
		}));
	});
}

export async function getOwner(id: string) {
	return await executeInOwners(async (collection) => {
		const owner = await collection.findOne<Owner>({
			_id: ObjectId.createFromHexString(id)
		});
		if (!owner) {
			return null;
		}

		return {
			...owner,
			_id: (owner._id as ObjectId)?.toHexString()
		};
	});
}

export async function createOwner(owner: Owner) {
	return await executeInOwners(async (collection) => {
		await collection.insertOne(owner);
	});
}

export async function updateOwner(owner: Owner) {
	return await executeInOwners(async (collection) => {
		owner._id = ObjectId.createFromHexString(owner._id as string);

		await collection.updateOne(
			{
				_id: owner._id
			},
			{
				$set: owner
			}
		);
	});
}

export async function deleteOwner(id: string) {
	return await executeInOwners(async (collection) => {
		await collection.deleteOne({
			_id: ObjectId.createFromHexString(id)
		});
	});
}

export async function getOwnerByToken(token: string) {
	return await executeInOwners(async (collection) => {
		const owner = await collection.findOne({
			tokens: token
		});
		if (!owner) {
			return null;
		}

		return {
			...owner,
			_id: (owner._id as ObjectId)?.toHexString()
		};
	});
}

export async function getOwnerByEmail(email: string) {
	return await executeInOwners(async (collection) => {
		const owner = await collection.findOne<Owner>({
			email
		});
		if (!owner) {
			return null;
		}

		return {
			...owner,
			_id: (owner._id as ObjectId)?.toHexString()
		};
	});
}

export async function getOwnerBySession(sessionToken: string) {
	return await executeInOwners(async (collection) => {
		const owner = await collection.findOne({
			'sessions.sessionToken': sessionToken
		});
		if (!owner) {
			return null;
		}

		return {
			...owner,
			_id: (owner._id as ObjectId)?.toHexString()
		};
	});
}

export async function getOwnerByOidcId(oidcId: string) {
	return await executeInOwners(async (collection) => {
		const owner = await collection.findOne({
			oidcId
		});
		if (!owner) {
			return null;
		}

		return {
			...owner,
			_id: (owner._id as ObjectId)?.toHexString()
		};
	});
}

export async function createSession(sessionToken: string, userId: string, expires: Date) {
	const owner = await getOwnerByOidcId(userId);
	if (owner) {
		if (!owner.sessions) {
			owner.sessions = [];
		}

		owner.sessions.push({
			sessionToken,
			expires
		});

		await updateOwner(owner);
	}
}

export async function deleteSession(sessionToken: string) {
	const owner = await getOwnerBySession(sessionToken);
	if (owner) {
		if (!owner.sessions) {
			owner.sessions = [];
		}

		owner.sessions = owner.sessions.filter((s) => s.sessionToken !== sessionToken);

		await updateOwner(owner);
	}
}

export async function getAdmins() {
	return await executeInOwners(async (collection) => {
		const owners = await collection
			.find({
				roles: 'admin'
			})
			.toArray();

		return owners.map((owner) => ({
			...owner,
			_id: (owner._id as ObjectId)?.toHexString()
		}));
	});
}
