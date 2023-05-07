const {MessageEmbed} = require('discord.js');

module.exports.run = async function(BOT, author, args, msg) {
	if (args.length === 0)
		return msg.channel.send(':negative_squared_cross_mark: Not enough arguments.');

	let title, desc,
		guildid = msg.guild.id;

	if (args.length === 1) {
		desc = args[0].replace(new RegExp('_', 'gi'), ' ');
		msg.channel.send(':warning: No title given. The given title will be the description\'s embed.');
	} else {
		title = args[0].replace(new RegExp('_', 'gi'), ' ');
		desc = args.slice(1).join(' ');
	}

	if (typeof desc === 'string')
		await BOT.dbCommands.setJoinDMMessage(BOT.database, guildid, desc);
	else
		desc = await BOT.dbCommands.getJoinDMMessages(BOT.database)[guildid];

	if (typeof title === 'string')
		await BOT.dbCommands.setJoinDMMessageTitle(BOT.database, guildid, title);
	else
		title = await BOT.dbCommands.getJoinDMMessagesTitles(BOT.database)[guildid];

	BOT._refreshMod('join-dm-msg');

	msg.channel.send(new MessageEmbed()
		.setTitle(':white_check_mark:')
		.addField('DM Message\'s title', typeof title === 'string' ? title : 'none', true)
		.addField('DM Message\'s description', desc, true)
		.setFooter('Changes may take some time to appear.')
		.setColor('#43cc24'));
};

module.exports.about = {
	'command': 'set-joinmessage',
	'description': 'Sets the join message\'s title & description.\nWrite null as desc or title to don\'t write the desc. or the title.',
	'examples': ['set-join-message TITLE_WITH_NICE_SPACES DESC AND More spaaaces and even #channels', '\nset-join DESC', '\nsjm null null *no message*', '\nsjm "well you can use quotes" "this is some nice quotes right here"'],
	'discord': true,
	'terminal': false,
	'list': true,
	'listTerminal': false,
	'aliases': 'sjm',
	'onlyMasterUsers': true
};