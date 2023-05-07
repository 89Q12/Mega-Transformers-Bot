const scold = require('../data/scoldImages.json');

module.exports.run = async function(BOT, author, args, msg) {
	if (!msg.mentions.users.size) {
		return msg.channel.send('Who do you want me to scold?');
	}

	msg.channel.send(msg.mentions.users.first().toString() + scold[Math.floor(Math.random() * scold.length)]);
};

module.exports.about = {
	'command': 'scold',
	'description': 'scold a user',
	'examples': ['scold <mention user>'],
	'discord': true,
	'terminal': false,
	'list': true,
	'listTerminal': false,
	'onlyMasterUsers': false
};
