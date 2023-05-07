const quote = require('../data/quotes.json');

module.exports.run = async function(BOT, author, args, msg) {
	msg.channel.send(quote[Math.floor(Math.random() * quote.length)]);
};

module.exports.about = {
	'command': 'quote',
	'description': 'Get a quote from BOT Gasai',
	'discord': true,
	'terminal': false,
	'list': true,
	'listTerminal': false,
	'onlyMasterUsers': false
};