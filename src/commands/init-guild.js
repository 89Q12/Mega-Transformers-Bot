module.exports.runTerminal = async function(yuno, args) {
	if (args.length === 0 || isNaN(parseInt(args[0])))
		return yuno.prompt.error('Please give the id of the guild in argument.');

	await yuno.dbCommands.initGuild(yuno.database, args[0]);
	return yuno.prompt.info('Guild successfully inited.');
};

module.exports.run = async function(yuno, author, args, msg) {
	await yuno.dbCommands.initGuild(yuno.database, msg.guild.id);
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