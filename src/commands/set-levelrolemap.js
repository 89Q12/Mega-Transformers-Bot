module.exports.run = async function(yuno, author, args, msg) {
	if (args.length === 0)
		return msg.channel.send(':negative_squared_cross_mark: Not enough arguments.');

	let thing = args.join(' ');

	try {
		thing = JSON.parse(thing);
	} catch(e) {
		return msg.channel.send(':negative_squared_cross_mark: Not a valid json object.\nRemember, they should have as key the level and as value the role id!');
	}

	await yuno.dbCommands.setLevelRoleMap(yuno.database, msg.guild.id, thing);
	yuno._refreshMod('message-processors');
	msg.channel.send('Updated!');
};

module.exports.about = {
	'command': 'set-levelrolemap',
	'description': 'Defines the level role map for this guild.',
	'examples': ['set-levelrolemap [some nice json object right here]'],
	'discord': true,
	'terminal': false,
	'list': true,
	'listTerminal': false,
	'aliases': ['slrmap'],
	'onlyMasterUsers': true
};