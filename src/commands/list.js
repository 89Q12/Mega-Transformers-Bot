const EmbedCmdResponse = require('../lib/EmbedCmdResponse'),
	{MessageEmbed} = require('discord.js');

let listMainCommands = function(yuno, isTerminal, member) {
	let cmdman = yuno.commandMan,
		commands = Object.values(cmdman.commands),
		keys = Object.keys(cmdman.commands);

	let ret = [];

	commands.forEach(function(el, i) {
		el = el.about;
		if (el.listTerminal === false && isTerminal === true)
			return;

		if (el.list === false && isTerminal === false)
			return;

		// removing aliases
		if (el.command !== keys[i])
			return;

		if (isTerminal === false) {
			let isUM = yuno.commandMan._isUserMaster(member.id);

			if (!isUM && el.onlyMasterUsers === true)
				return;

			if (!isUM && !yuno.commandMan._hasPermissions(member, el.requiredPermissions))
				return;
		}

		ret.push(keys[i]);
	});

	return ret.join(', ');
};

let helpOnACommand = function(command, yuno, msg) {
	let cmdman = yuno.commandMan,
		isTerminal = !msg;

	if (!cmdman._commandExists(command))
		if (isTerminal)
			return yuno.prompt.error('The command ' + command + ' doesn\'t exists.');
		else
			return msg.channel.send('The command ' + command + ' doesn\'t exists.');

	command = cmdman.commands[command];

	let commandName = command.about.command,
		aliases = command.about.aliases,
		usage = command.about.usage,
		examples = command.about.examples,
		description = command.about.description;
	requiredPermissions = command.about.requiredPermissions,
	usableOnDiscord = command.about.discord,
	usableOnTerminal = command.about.terminal,
	listedOnDiscord = command.about.list,
	listedOnTerminal = command.about.listTerminal,
	onlyMasterUsers = command.about.onlyMasterUsers;

	let defaulter = function(value, ret) {
		if (typeof value !== 'boolean')
			return typeof ret === 'boolean' ? ret : true;
		return value;
	};

	if ((listedOnDiscord === false || usableOnDiscord === false) && !isTerminal)
		return msg.channel.send('The command ' + commandName + ' doesn\'t exists.'); // brain
    
	if (listedOnTerminal === false && usableOnTerminal === false && isTerminal)
		yuno.prompt.warn('Command ' + commandName + ' is not usable & not listed in terminal.');
	else if (listedOnTerminal === false && isTerminal)
		yuno.prompt.warn('Command ' + commandName + ' not listed in terminal.');
	else if (usableOnTerminal === false && isTerminal)
		yuno.prompt.warn('Command ' + commandName + ' is not usable in terminal');

	if (isTerminal) {
		let lines = [
			'Command name: ' + commandName
		];

		if (aliases) {
			if (aliases instanceof Array)
				if (aliases.length > 1)
					lines.push('Aliases' + ': ' + aliases.join(','));
				else
					aliases = aliases[0];
			if (typeof aliases === 'string')
				lines.push('Alias: ' + aliases);
		}
        
		if (!(aliases instanceof Array || typeof aliases === 'string'))
			lines.push('Aliases: ' + 'None');

		if (typeof description === 'string')
			lines.push('Description: ' + description);

		if (typeof usage === 'string')
			lines.push('Usage: ' + usage);

		if (examples) {
			if (examples instanceof Array)
				if (examples.length > 1)
					lines.push('Examples' + ': ' + examples.join(','));
				else
					examples = examples[0];
			if (typeof examples === 'string')
				lines.push('Examples: ' + examples);
		}
		if (!(examples instanceof Array || typeof examples === 'string'))
			lines.push('Examples: ' + 'None');

		if (requiredPermissions) {
			if (requiredPermissions instanceof Array)
				if (requiredPermissions.length > 1)
					lines.push('Required permissions' + ': ' + requiredPermissions.join(','));
				else
					requiredPermissions = requiredPermissions[0];
			if (typeof requiredPermissions === 'string')
				lines.push('Required permission: ' + requiredPermissions);
		}
		if (!(requiredPermissions instanceof Array || typeof requiredPermissions === 'string'))
			lines.push('Required permissions: ' + 'None');

		lines.push('Usable on discord: ' + defaulter(usableOnDiscord));
		lines.push('Usable on terminal: ' + defaulter(usableOnTerminal));
		lines.push('Listed on discord (through help/list): ' + defaulter(listedOnDiscord));
		lines.push('Listed on terminal: ' + defaulter(listedOnTerminal));
		lines.push('Usable only by master users: ' + defaulter(onlyMasterUsers, false));

		lines.forEach(el => yuno.prompt.info(el));
		return;
	} else {
		let response = new MessageEmbed()
			.setColor('#42d1f4')
			.addField('Command name', commandName, true);

		EmbedCmdResponse.setCMDRequester(response, msg.member);
        
		if (aliases instanceof Array)
			if (aliases.length === 1)
				aliases = aliases[0];
			else
				response.addField('Aliases', aliases.join(', '), true);

		if (typeof aliases === 'string')
			response.addField('Alias', aliases, true);

		if (typeof usage === 'string')
			response.addField('Usage', usage, true);

		if (typeof description === 'string')
			response.addField('Description', description);

		if (examples instanceof Array)
			if (examples.length === 1)
				examples = examples[0];
			else
				response.addField('Examples', examples.join(', '), true);
		if (typeof examples === 'string')
			response.addField('Example', examples, true);

		return msg.channel.send(response);
	}
};

/*
    List commands
*/
module.exports.run = async function(yuno, author, args, msg) {
	if (args.length === 0 || args[0].trim() === '')
		if (author !== 0) {
			let response = new EmbedCmdResponse();
			response.setColor('#ff51ff')
				.setTitle('Little help about the commands.')
				.setDescription('`' + listMainCommands(yuno, false, msg.member) + '`')
				.setCMDRequester(msg.member);
			msg.channel.send(response);
		} else
			return yuno.prompt.info('The available commands are :\n    ' + listMainCommands(yuno, true));
	else
		helpOnACommand(args[0].trim().toLowerCase(), yuno, msg);

};

module.exports.about = {
	'command': 'list',
	'description': 'Lists the commands',
	'discord': true,
	'terminal': true,
	'list': false,
	'listTerminal': true,
	'examples': 'help anothercommand',
	'requiredPermissions': [],
	'aliases': ['help']
};