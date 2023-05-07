import { Entity, Property, PrimaryKey } from '@mikro-orm/core';

@Entity()
export class Experiences {
	@Property({ columnType: 'INTEGER', nullable: false })
		level!: string;
	@PrimaryKey()
	@Property({ fieldName: 'userID', columnType: 'STRING', nullable: false })
		userID!: string;

	@Property({ fieldName: 'guildID', columnType: 'STRING', nullable: false })
		guildID!: string;

	@Property({ columnType: 'INTEGER', nullable: false })
		exp!: number;
}
