const quote = require('../data/quotes.json');

module.exports.run = async function(yuno, author, args, msg) {
	msg.channel.send(quote[Math.floor(Math.random() * quote.length)]);
};

module.exports.about = {
	'command': 'quote',
	'description': 'Get a quote from Yuno Gasai',
	'discord': true,
	'terminal': false,
	'list': true,
	'listTerminal': false,
	'onlyMasterUsers': false
};