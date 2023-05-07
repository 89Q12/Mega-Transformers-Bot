const {MessageEmbed} = require('discord.js');

module.exports.run = async function(BOT, author, args, msg) {
	let toSay = [];

	(await BOT.dbCommands.getMentionResponses(BOT.database)).forEach(el => {
		if (el.guildId === msg.guild.id)
			toSay.push('trigger: ' + el.trigger + ', response: ' + el.response + (el.image !== 'null' ? ', image: ' + el.image : ''));
	});

	if (toSay.length === 0)
		return 'No mention responses found.';
	else
		return msg.channel.send(toSay.join('\n'));
};

module.exports.about = {
	'command': 'mentionresponses',
	'description': 'List mention responses for the actual server.',
	'usage': 'mentionresponse',
	'examples': 'mentionresponse',
	'discord': true,
	'terminal': false,
	'list': true,
	'listTerminal': false,
	'onlyMasterUsers': true
};