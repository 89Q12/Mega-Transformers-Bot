module.exports.run = async function(BOT, author, args, msg) {
	if (args.length === 0)
		return msg.channel.send(':negative_squared_cross_mark: Not enough arguments.');

	if (!BOT.UTIL.checkIfUrl(args[0]))
		return msg.channel.send(':negative_squared_cross_mark: The first argument provided isn\'t a URL as required.');
    
	let user = msg.member;

	if (msg.mentions.users.size) {
		let target = msg.mentions.users.first();
		if (BOT.commandMan._isUserMaster(msg.author.id) || msg.member.roles.highest.comparePositionTo(msg.guild.members.get(target.id).roles.highest) > 0)
			user = target;
	}

	let r = await BOT.dbCommands.setBanImage(BOT.database, msg.guild.id, user.id, args[0]);

	if (r[0] === 'creating')
		return msg.channel.send(':white_check_mark: Ban image set!');
	else
		return msg.channel.send(':white_check_mark: Ban image updated!');
};

module.exports.about = {
	'command': 'set-banimage',
	'description': 'Defines the ban image for you or someone else.',
	'usage': 'set-banimage <url> [user-mention]',
	'examples': ['set-banimage http://imgur.com/i/nicegif.gif', 'set-banimage <theurl> @someone'],
	'discord': true,
	'terminal': false,
	'list': true,
	'listTerminal': false,
	'aliases': ['sbanimg'],
	'requiredPermissions': ['BAN_MEMBERS']
};