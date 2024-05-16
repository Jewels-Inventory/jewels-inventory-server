import type { Owner } from '$lib/database/models';
import { Collection, MongoClient, ObjectId } from 'mongodb';
import { env } from '$env/dynamic/private';

async function executeInOwners<T>(cb: (collection: Collection<Owner>) => Promise<T>) {
	const client = new MongoClient(env.MONGO_URI);
	try {
		const db = client.db(env.MONGO_DATABASE);
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
			_id: (owner._id as ObjectId)?.toHexString(),
			email: owner.email as string,
			name: owner.name as string,
			devices: owner.devices,
			tokens: owner.tokens
		}));
	});
}

export async function getOwner(id: string) {
	return await executeInOwners(async (collection) => {
		return await collection.findOne<Owner>({
			_id: ObjectId.createFromHexString(id)
		});
	});
}

export async function createOwner(owner: Owner) {
	return await executeInOwners(async (collection) => {
		await collection.insertOne(owner);
	});
}

export async function updateOwner(owner: Owner) {
	return await executeInOwners(async (collection) => {
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
		return await collection.findOne({
			tokens: token
		});
	});
}
