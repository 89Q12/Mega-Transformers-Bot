import { CommandType } from '../interfaces/Command';

export class Command {
	constructor(commandOptions: CommandType) {
		Object.assign(this, commandOptions);
	}
}
