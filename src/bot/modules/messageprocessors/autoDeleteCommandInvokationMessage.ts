import { MessageProcessor } from '../../lib/MessageProcessor';

export default new MessageProcessor({
	name: 'autoDeleteCmdInvokeMsg',
	ignoreCommands: false,
	process: async (message) => {
		await message.delete();
	},
});
