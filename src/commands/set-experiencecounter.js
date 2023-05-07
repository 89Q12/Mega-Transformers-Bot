module.exports.run = async function(yuno, author, args, msg) {
	if (args.length === 0)
		return msg.channel.send(':negative_squared_cross_mark: Not enough arguments.');

	let thing = args[0],
		to = null;

	if (thing.indexOf('enab') === 0)
		to = true;

	if (thing.indexOf('disab') === 0)
		to = false;

	if (thing.indexOf('tru') === 0)
		to = true;

	if (thing.indexOf('fa') === 0)
		to = false;

	if (to === null)
		return msg.channel.send('Couldn\'t determine whether you wanted to enable or disable the experience counter. Some examples: ```'  + ['enable', 'disable', 'true', 'false', 'enab', 'disab', 'tru', 'fa'].join('\n') + ' ```');

	await yuno.dbCommands.setXPEnabled(yuno.database, msg.guild.id, thing);
	yuno._refreshMod('message-processors');
	msg.channel.send('Experience counter is now ' + (to ? 'enabled': 'disabled') + ' on this guild.\nEffects will appear in a few seconds.');
};

module.exports.about = {
	'command': 'set-experiencecounter',
	'description': '__Enables__ or __disables__ the experience counter for the current guild.',
	'examples': ['set-expcounter true', 'set-expcounter false', 'set-expcounter enable'],
	'discord': true,
	'terminal': false,
	'list': true,
	'listTerminal': false,
	'aliases': ['set-expcounter', 'sexpcounter'],
	'onlyMasterUsers': true
};