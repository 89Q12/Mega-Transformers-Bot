import { Entity, Property, PrimaryKey } from '@mikro-orm/core';

@Entity({ collection: 'banImages' })
export class BanImages {
	@PrimaryKey()
		id!: number;
	@Property({ columnType: 'TEXT', nullable: true })
		gid!: string;

	@Property({ columnType: 'TEXT', nullable: true })
		banner!: string;

	@Property({ columnType: 'TEXT', nullable: true })
		image!: string;
}
