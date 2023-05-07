const {MessageEmbed} = require('discord.js');

module.exports.run = async function(BOT, author, args, msg) {
	if (args.length === 0)
		return msg.channel.send(':negative_squared_cross_mark: Not enough argument.');

	let trigger = args[0];

	let r = await BOT.dbCommands.getMentionResponseFromTrigger(BOT.database, msg.guild.id, trigger);
	alreadyExists = r !== null;

	if (!alreadyExists)
		return msg.channel.send(':negative_squared_cross_mark: There\'s no mention response for this guild with this trigger.');

	await BOT.dbCommands.delMentionResponse(BOT.database, r.id);

	BOT._refreshMod('message-processors');
	msg.channel.send(':white_check_mark: Mention response deleted!');
};

module.exports.about = {
	'command': 'del-mentionresponse',
	'description': 'Deletes a mention response.',
	'usage': 'del-mentionresponse <trigger>',
	'examples': 'del-mentionresponse "good job"',
	'discord': true,
	'terminal': false,
	'list': true,
	'listTerminal': false,
	'onlyMasterUsers': true
};