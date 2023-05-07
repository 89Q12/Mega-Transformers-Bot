const {MessageEmbed} = require('discord.js');

module.exports.run = async function(yuno, author, args, msg) {
	msg.author.send(new MessageEmbed()
		.setColor('#ff51ff')
		.setAuthor('Yuno Gasai\'s source', yuno.dC.user.avatarURL)
		.setDescription('Yuno Gasai\'s source code is available on [GitHub.com](https://github.com/blubaustin/Yuno-Gasai-2/).')
		.setFooter('Yuno version ' + yuno.version + '. The bot is under the GNU AGPL License. Written by Maeeen#8264.')
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
