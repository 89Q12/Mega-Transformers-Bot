module.exports.run = async function(BOT, author, args, msg) {
	if (!msg.mentions.channels.size)
		return msg.channel.send('Please mention a channel.');

	BOT.config.set('errors.dropon', {
		'guild': msg.guild.id,
		'channel': msg.mentions.channels.first().name
	});

	await BOT._refreshMod('bot-errors');
};

module.exports.about = {
	'command': 'drop-errors-on',
	'description': 'Defines the channel where errors will be dropped..',
	'examples': ['drop-errors-on #channel-mention'],
	'discord': true,
	'terminal': false,
	'list': true,
	'listTerminal': false,
	'aliases': ['drop-err-on'],
	'onlyMasterUsers': true
};