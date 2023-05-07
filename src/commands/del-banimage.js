module.exports.run = async function(yuno, author, args, msg) {
	let user = msg.member;

	if (msg.mentions.users.size) {
		let target = msg.mentions.users.first();
		if (yuno.commandMan._isUserMaster(msg.author.id) || msg.member.roles.highest.comparePositionTo(msg.guild.members.get(target.id).roles.highest) > 0)
			user = target;
	}

	let r = await yuno.dbCommands.delBanImage(yuno.database, msg.guild.id, user.id);

	if (user.id === msg.author.id)
		return msg.channel.send(':white_check_mark: Your ban image has been deleted!');
	else
		return msg.channel.send(':white_check_mark: **' + user.user.username + '**\'s ban image has been deleted!');
};

module.exports.about = {
	'command': 'del-banimage',
	'description': 'Deletes the ban image for you or someone else.',
	'usage': 'del-banimage [user-mention]',
	'discord': true,
	'terminal': false,
	'list': true,
	'listTerminal': false,
	'requiredPermissions': ['BAN_MEMBERS']
};