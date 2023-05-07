import { BOT } from './src/BotClient';
import * as DEFAULT_CONFIG from './DEFAULT_CONFIG.json';
import { BotConfig } from './src/interfaces/Client';

(async () => {
	try {
		console.log('Starting ');
		// Creates a new Yuno instance, a guild ID must be passed
		const instance = new Yuno();
		await instance.start(DEFAULT_CONFIG as BotConfig);
		// Sets a listeners for easier debugging
		if (process.env.NODE_ENV !== 'production') {
			process.on('uncaughtException', (err) => {
				console.log('\x1b[35m', 'Stack-Trace: ' + err.stack);
			});

			process.on('unhandledRejection', (err: unknown) => {
				console.log(
					'\x1b[35m',
					'Stack-Trace: ' + (err instanceof Error ? err.stack : '')
				);
			});
		}
		process.on('warning', (warn: Error) => {
			console.log('\x1b[35m', warn.name);
			console.log('\x1b[35m', warn.message);
			console.log('\x1b[35m', warn.stack);
			process.exit(1);
		});
	} catch (e: unknown) {
		//Critical error probably no token and no guildid
		console.error(`Critical error: ${e instanceof Error ? e.stack : e}`);
	}
})();
