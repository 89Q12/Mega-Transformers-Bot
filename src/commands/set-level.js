const {MessageEmbed} = require('discord.js');

let whereExpIsEnabled = [];

module.exports.run = async function(yuno, author, args, msg) {
	await fetchWhereExpIsEnabled(yuno);

	if (!whereExpIsEnabled.includes(msg.guild.id))
		return msg.channel.send('Experience counting is __disabled__ on the server.');
	// to edit the database after that experience.js has made any changes.
	setTimeout(async function() {
		if (args.length === 0)
			return msg.channel.send(':negative_squared_cross_mark: Not enough arguments.');

		let givenLvl;

		try {
			givenLvl = parseInt(args[0]);
		} catch(e) {
			return msg.channel.send('The first argument you gave (level) is not an int as expected.');
		}

		let user = msg.member,
			g = msg.guild.id;

		if (msg.mentions.members.size)
			user = msg.mentions.members.first();
        
		if (user.user.bot)
			return msg.channel.send(':robot: Bots doesn\'t have xp!');

		await yuno.dbCommands.setXPData(yuno.database, g, user.id, 0, givenLvl);


		let xpdata = await yuno.dbCommands.getXPData(yuno.database, msg.guild.id, user.id),
			neededExp = 5 * Math.pow(xpdata.level, 2) + 50 * xpdata.level + 100;

		return msg.channel.send(new MessageEmbed()
			.setAuthor(user.displayName + '\'s experience card' , yuno.UTIL.getAvatarURL(user.user))
			.setTitle('Level has been changed.')
			.setColor('#ff51ff')
			.addField('Current level', xpdata.level, true)
			.addField('Current exp', xpdata.xp, true)
			.addField('Exp needed until next level (' + (xpdata.level + 1) + ')', neededExp - xpdata.xp));

	}, 350);
};

let fetchWhereExpIsEnabled = async function(yuno) {
	if (whereExpIsEnabled.length > 0)
		return;

	whereExpIsEnabled = await yuno.dbCommands.getGuildsWhereExpIsEnabled(yuno.database);
};


module.exports.about = {
	'command': 'set-level',
	'description': 'Sets the given level for a given user.',
	'examples': ['set-level 5', 'set-level 8 @[user]'],
	'discord': true,
	'terminal': false,
	'list': true,
	'listTerminal': false,
	'aliases': 'slvl',
	'onlyMasterUsers': true
};