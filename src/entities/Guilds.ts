import { Entity, Property, PrimaryKey } from '@mikro-orm/core';

@Entity()
export class Guilds {
	@PrimaryKey()
		id!: number;

	@Property({ columnType: 'VARCHAR(5)', nullable: true })
		prefix!: string;

	@Property({ fieldName: 'onJoinDMMsg', columnType: 'TEXT', nullable: true })
		onJoinDMMsg!: string;

	@Property({
		fieldName: 'onJoinDMMsgTitle',
		columnType: 'VARCHAR(255)',
		nullable: true,
	})
		onJoinDMMsgTitle!: string;

	@Property({ fieldName: 'spamFilter', columnType: 'BOOL', nullable: true })
		spamFilter!: string;

	@Property({ fieldName: 'measureXP', columnType: 'BOOL', nullable: true })
		measureXP!: string;

	@Property({ fieldName: 'levelRoleMap', columnType: 'TEXT', nullable: true })
		levelRoleMap!: string;
}
