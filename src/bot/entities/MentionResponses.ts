import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ collection: 'mentionResponses' })
export class MentionResponses {
	@PrimaryKey({ columnType: 'INTEGER', nullable: true })
		id!: number;

	@Property({ columnType: 'TEXT', nullable: true })
		gid!: string;

	@Property({ columnType: 'TEXT', nullable: true })
		trigger!: string;

	@Property({ columnType: 'TEXT', nullable: true })
		response!: string;

	@Property({ columnType: 'TEXT', nullable: true })
		image!: string;
}
