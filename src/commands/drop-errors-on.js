module.exports.run = async function(yuno, author, args, msg) {
	if (!msg.mentions.channels.size)
		return msg.channel.send('Please mention a channel.');

	yuno.config.set('errors.dropon', {
		'guild': msg.guild.id,
		'channel': msg.mentions.channels.first().name
	});

	await yuno._refreshMod('bot-errors');
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