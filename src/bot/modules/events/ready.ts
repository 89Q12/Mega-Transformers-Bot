import BotEvent from '../../interfaces/Event';


export default class ReadyEvent implements BotEvent<'ready'> {
	run() {
	// Do things that should be done when the bot is ready
		console.log('Bot is online');
	}
}
