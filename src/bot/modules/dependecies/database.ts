import { PrismaClient } from '@prisma/client';
import {singleton} from 'tsyringe';
import { Dependency } from '../../interfaces/dependency';
/**
 * Use this class to write your database implementation.
 * This is by design not typed via an interface as I cannot know your use case and leave it up to you.
 * This is injectable.
 */
@singleton()
export class Database{
	prisma: PrismaClient;
	/**
     * Constructs the database layer and the client
     */
	constructor() {
		this.prisma = new PrismaClient();
	}
}

export default {
	name: 'Database'
} as Dependency;