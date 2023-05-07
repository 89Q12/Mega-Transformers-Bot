import { Entity, Property, PrimaryKey } from '@mikro-orm/core';

@Entity()
export class Channelcleans {
	@Property({ columnType: 'TEXT', nullable: true })
		gid!: string;
	@PrimaryKey()
	@Property({ columnType: 'TEXT', nullable: true })
		cname!: string;

	@Property({ columnType: 'INTEGER', nullable: true })
		cleantime!: string;

	@Property({ columnType: 'INTEGER', nullable: true })
		warningtime!: string;

	@Property({ columnType: 'TEXT', nullable: true })
		remainingtime!: string;
}
