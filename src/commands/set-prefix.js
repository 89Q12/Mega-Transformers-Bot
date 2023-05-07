module.exports.run = async function(yuno, author, args, msg) {
	let prefix = '!';

	if (args.length === 0)
		prefix = yuno.config.get('commands.default-prefix');
	else
		prefix = args[0];

	let oldPrefixes = await yuno.dbCommands.getPrefixes(yuno.database);

	if (Object.keys(oldPrefixes).includes(msg.guild.id))
		oldPrefix = oldPrefixes[msg.guild.id];
	else
		oldPrefix = yuno.config.get('commands.default-prefix');

	if (oldPrefix === prefix)
		return msg.channel.send(':negative_squared_cross_mark: The prefix you gave is the actual prefix. No changes has been made.');

	await yuno.dbCommands.setPrefix(yuno.database, msg.guild.id, prefix);

	yuno._refreshMod('command-executor');
	return msg.channel.send(':white_check_mark: Prefix changed to : `'+ prefix +' `\n:arrow_right: Hot reloading the command-executor module... Bot may be unresponsive for a few secs.');
};

module.exports.about = {
	'command': 'set-prefix',
	'description': 'Sets the prefix for the guild.',
	'examples': ['set-prefix !', '\nset-prefix *// sets default*', '\nset-prefix yuno-'],
	'discord': true,
	'terminal': false,
	'list': true,
	'listTerminal': false,
	'aliases': 'spref',
	'onlyMasterUsers': true
};