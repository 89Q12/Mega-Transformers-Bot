import { MessageProcessorType } from '../interfaces/messageProcessor';
export class MessageProcessor {
	constructor(messageProcessorOptions: MessageProcessorType) {
		Object.assign(this, messageProcessorOptions);
	}
}
