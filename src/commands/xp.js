const {MessageEmbed} = require('discord.js');

let whereExpIsEnabled = [];

let getAvatarURL = function(user) {
	return user.avatarURL ? user.avatarURL : user.defaultAvatarURL;
};

module.exports.run = async function(yuno, author, args, msg) {
	await fetchWhereExpIsEnabled(yuno);

    
	// Obtain the member if we don't have it
	if(msg.guild && !msg.guild.members.cache.has(msg.author.id) && !msg.webhookID) {
		msg.member = await msg.guild.members.fetch(msg.author);
	}
	// Obtain the member for the ClientUser if it doesn't already exist
	if(msg.guild && !msg.guild.members.cache.has(Yuno.dC.user.id)) {
		await msg.guild.members.fetch(Yuno.dC.user.id);
	}
    
	if (!whereExpIsEnabled.includes(msg.guild.id))
		return msg.channel.send('Experience counting is __disabled__ on the server.');

	let user = msg.member,
		fromid = false;

	if (msg.mentions.users.size)
		user = msg.mentions.members.first();

	if (args.length > 0) {
		let el = args[0];

		(function(el) {
			if (el.indexOf('<') === 0 && el.indexOf('>') === el.length -1)
				if (el.length >= 17 + 3 && el.length <= 19 + 3)
					if (!isNaN(parseInt(el[5])))
						return;

			let temp = msg.guild.members.cache.get(el);

			fromid = true;

			if (temp) {
				user = temp;
			}
		})(el);
	}
    
	if (user.user.bot)
		return msg.channel.send(':robot: Bots don\'t have xp!');

	if (user.id === msg.author.id && args.length > 0 && fromid)
		return msg.channel.send(':negative_squared_cross_mark: Cannot find the asked user. He\'s maybe not on the server :thinking: ?');

	let xpdata = await yuno.dbCommands.getXPData(yuno.database, msg.guild.id, user.id),
		neededExp = 5 * Math.pow(xpdata.level, 2) + 50 * xpdata.level + 100;

	msg.channel.send(new MessageEmbed()
		.setAuthor(user.displayName + '\'s experience card' , yuno.UTIL.getAvatarURL(user.user))
		.setColor('#ff51ff')
		.addField('Current level', xpdata.level, true)
		.addField('Current exp', xpdata.xp, true)
		.addField('Exp needed until next level (' + (xpdata.level + 1) + ')', neededExp - xpdata.xp));
};


let fetchWhereExpIsEnabled = async function(yuno) {
	if (whereExpIsEnabled.length > 0)
		return;

	whereExpIsEnabled = await yuno.dbCommands.getGuildsWhereExpIsEnabled(yuno.database);
};



module.exports.about = {
	'command': 'xp',
	'aliases': ['rank', 'level', 'exp'],
	'list': true,
	'listTerminal': false,
	'discord': true,
	'terminal': false,
	'examples': ['xp @mention', 'xp [id]', 'xp [name]']
};
