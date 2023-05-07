const {GuildMember, MessageEmbed} = require('discord.js');

module.exports.run = async function(yuno, author, args, msg) {
	let g = msg.guild,
		bans = await msg.guild.fetchBans();

	// TODO
};

module.exports.about = {
	'command': 'mod-stats',
	'description': 'Give some stats about moderators.',
	'examples': ['mod-stats'],
	'discord': true,
	'terminal': false,
	'list': true,
	'listTerminal': false,
	'requiredPermissions': ['MANAGE_ROLES'],
	'aliases': 'ms'
};