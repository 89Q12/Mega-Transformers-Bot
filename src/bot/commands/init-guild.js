module.exports.runTerminal = async function(BOT, args) {
	if (args.length === 0 || isNaN(parseInt(args[0])))
		return BOT.prompt.error('Please give the id of the guild in argument.');

	await BOT.dbCommands.initGuild(BOT.database, args[0]);
	return BOT.prompt.info('Guild successfully inited.');
};

module.exports.run = async function(BOT, author, args, msg) {
	await BOT.dbCommands.initGuild(BOT.database, msg.guild.id);
	msg.channel.send('Guild inited in the database.');
};

module.exports.about = {
	'command': 'init-guild',
	'description': 'Debug command.',
	'discord': true,
	'terminal': true,
	'list': false,
	'listTerminal': true,
	'onlyMasterUsers': true
};