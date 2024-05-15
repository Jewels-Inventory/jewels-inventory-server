import type { Owner } from '$lib/database/models';
import { Collection, MongoClient, ObjectId } from 'mongodb';

async function executeInOwners<T>(cb: (collection: Collection<Owner>) => Promise<T>) {
	const client = new MongoClient(process.env.MONGO_URI);
	try {
		const db = client.db(process.env.MONGO_DATABASE);
		const collection = db.collection<Owner>('owners');

		return await cb(collection);
	} finally {
		await client.close();
	}
}

export async function getOwners(): Promise<Owner[]> {
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

export async function getOwner(id: string): Promise<Owner | null> {
	return await executeInOwners(async (collection) => {
		return await collection.findOne<Owner>({
			_id: ObjectId.createFromHexString(id)
		});
	});
}

export async function createOwner(owner: Owner): Promise<void> {
	return await executeInOwners(async (collection) => {
		await collection.insertOne(owner);
	});
}

export async function updateOwner(owner: Owner): Promise<void> {
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

export async function deleteOwner(id: string): Promise<void> {
	return await executeInOwners(async (collection) => {
		const res = await collection.deleteOne({
			_id: ObjectId.createFromHexString(id)
		});
		console.log(res);
	});
}
