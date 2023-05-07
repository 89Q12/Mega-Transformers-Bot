const {MessageEmbed} = require('discord.js');

module.exports.run = async function(yuno, author, args, msg) {
	if (args.length <= 1)
		return msg.channel.send(':negative_squared_cross_mark: You must provide a trigger and response, url is not required.');

	let trigger = args[0],
		response = args[1],
		image = args[args.length - 1];

	if (!yuno.UTIL.checkIfUrl(image))
		image = null;
        
	let alreadyExists = (await yuno.dbCommands.getMentionResponseFromTrigger(yuno.database, msg.guild.id, trigger)) !== null;

	if (alreadyExists)
		return msg.channel.send(':negative_squared_cross_mark: This guild already has a trigger for this.');

	let r = await yuno.dbCommands.addMentionResponses(yuno.database, msg.guild.id, trigger, response, image);
	yuno._refreshMod('message-processors');
	msg.channel.send(new MessageEmbed()
		.setTitle(':white_check_mark: Mention response added.')
		.addField('Trigger', trigger, true)
		.addField('Response', response, true)
		.addField('Image', typeof image === 'string' ? image : 'None.', true)
		.setColor('#43cc24'));
};

module.exports.about = {
	'command': 'add-mentionresponse',
	'description': 'Adds a mention response.',
	'usage': 'add-mentionresponse "<trigger>" "<response>" [image]',
	'examples': 'add-mentionresponse "good job" "${author} woah nice thing"',
	'discord': true,
	'terminal': false,
	'list': true,
	'listTerminal': false,
	'onlyMasterUsers': true
};