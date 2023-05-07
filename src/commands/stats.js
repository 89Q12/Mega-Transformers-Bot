const moment = require('moment');
require('moment-duration-format');
const totalMem = require('os').totalmem();
const { version } = require('discord.js');

module.exports.run = async function(yuno, author, args, msg) {
	msg.channel.send({
		embed: {
			color: 0xe983b9,
			title: `Yuno ${Yuno.version}`,
			fields: [
				{ name: 'Uptime', value: moment.duration(process.uptime(), 'seconds').format('dd:hh:mm:ss'), inline: true },
				{ name: 'RAM Usage', value: `${(process.memoryUsage().rss / 1048576).toFixed()}MB/${(totalMem > 1073741824 ? `${(totalMem / 1073741824).toFixed(1)} GB` : `${(totalMem / 1048576).toFixed()} MB`)}\n(${(process.memoryUsage().rss / totalMem * 100).toFixed(2)}%)`, inline: true },
				{ name: 'System Info', value: `${process.platform} (${process.arch})\n${(totalMem > 1073741824 ? `${(totalMem / 1073741824).toFixed(1)} GB` : `${(totalMem / 1048576).toFixed(2)} MB`)}`, inline: true },
				{ name: 'Libraries', value: `[Yuno Gasai](https://github.com/japaneseenrichmentorganization/Yuno-Gasai-2) v${Yuno.version}\n[Node.js](https://nodejs.org) ${process.version}\n[Discord.js](https://discord.js.org) v${version}`, inline: true },
			]
		}});
};

module.exports.about = {
	'command': 'stats',
	'description': 'Get the information about Yuno',
	'discord': true,
	'terminal': false,
	'list': true,
	'listTerminal': false,
	'aliases': 'inf',
	'onlyMasterUsers': false
};