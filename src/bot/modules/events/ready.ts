import { Client } from 'discord.js';
import { Event } from '../../lib/Event';

export default new Event('ready', (client: Client<true>) => {
	// Do things that should be done when the bot is ready
	console.log('Bot is online');
});
