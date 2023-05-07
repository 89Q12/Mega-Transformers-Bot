let fs = require('fs');

module.exports.run = async function(yuno, author, args, msg) {
	if (!msg.member.hasPermission('BAN_MEMBERS'))
		return msg.channel.send('No permission to');

	let guid = msg.guild.id;

	msg.guild.fetchBans().then(bans => {
		let arr = Array.from(bans.values()),
			json = [];

		arr.forEach((el, ind, arr) => {
			json.push(el.user.id);
		});

		let banstr = JSON.stringify(json);

		fs.writeFile('./BANS-' + guid + '.txt', banstr, (err) => {
			if (err)
				msg.channel.send('Error while saving bans :( :' + err.code);
			else
				msg.channel.send('Bans saved with the Guild ID (use it to re-apply bans) : ' + guid);
		});
	});
};

module.exports.about = {
	'command': 'exportbans',
	'description': 'Export the banlist to a .txt',
	'examples': ['exportbans'],
	'discord': true,
	'terminal': false,
	'list': true,
	'listTerminal': false,
	'aliases': 'ebans',
	'onlyMasterUsers': true
};