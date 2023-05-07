const {MessageEmbed} = require('discord.js');

module.exports.run = async function(BOT, author, args, msg) {
	msg.author.send(new MessageEmbed()
		.setColor('#ff51ff')
		.setAuthor('BOT Gasai\'s source', BOT.dC.user.avatarURL)
		.setDescription('BOT Gasai\'s source code is available on [GitHub.com](https://github.com/blubaustin/BOT-Gasai-2/).')
		.setFooter('BOT version ' + BOT.version + '. The bot is under the GNU AGPL License. Written by Maeeen#8264.')
	);

	if (msg.guild)
		msg.delete();
};

module.exports.about = {
	'command': 'source',
	'description': 'Returns the source of the bot',
	'discord': true,
	'terminal': false,
	'list': true,
	'listTerminal': false,
	'onlyMasterUsers': false,
	'isDMPossible': true
};
