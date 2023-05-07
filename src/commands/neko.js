const {MessageEmbed} = require('discord.js');
const snekfetch = require('snekfetch');

module.exports.run = async function(BOT, author, args, msg) {
	let url = 'https://nekos.life/api';

	if (args[0] === 'lewd') {
		if (!msg.channel.nsfw) {
			return msg.channel.send('I don\'t think I\'m allowed to post those here... Maybe try a NSFW marked channel?');
		}
		url += '/lewd/neko';
	} else {
		url += '/neko';
	}

	const res = await snekfetch.get(url);
	msg.channel.send(new MessageEmbed()
		.setImage(res.body.neko)
		.setFooter(`Requested by ${msg.author.tag}`));
};

module.exports.about = {
	'command': 'neko',
	'description': 'Get a picture of a neko.',
	'examples': ['Neko | Neko Lewd in a NSFW marked channel to get lewd images'],
	'discord': true,
	'terminal': false,
	'list': true,
	'listTerminal': false,
	'aliases': 'nya',
	'onlyMasterUsers': false
};