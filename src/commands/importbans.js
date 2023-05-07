let fs = require('fs');

module.exports.run = async function(yuno, author, args, msg) {
	if (!args[0])
		return msg.channel.send('Give the guild-id please.');

	let guid = args[0];

	fs.readFile('./BANS-' + guid + '.txt', (err, data) => {
		if (err)
			msg.channel.send('Error while retrieving bans : ', err.code);
		else {
			console.log('[BanMSystem] Applying bans...');
			try {
				let bans = JSON.parse(data);
				bans.forEach((el, ind, arr) => {
					try {
						let getMember = msg.guild.members.fetch(el);
						msg.guild.ban(getMember);
					} catch(e) {
						console.log('Skipped: ' + el + 'error:' + e);
					}
				});
				msg.channel.send('Ban successful');
			} catch(e) {
				console.log('[BanMSystem] Bans we\'re not saved as JSON. Error :((((');
				msg.channel.send('Bans aren\'t in JSON. Error.');
			}
		}
	});
};

module.exports.about = {
	'command': 'importbans',
	'description': 'Import bans',
	'examples': ['importbans'],
	'discord': true,
	'terminal': false,
	'list': true,
	'listTerminal': false,
	'aliases': 'ibans',
	'onlyMasterUsers': true
};