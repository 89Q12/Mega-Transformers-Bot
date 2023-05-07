module.exports.run = async function(BOT, author, args, msg) {
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
		return msg.channel.send('Couldn\'t determine whether you wanted to enable or disable the spamfilter. Some examples: ```'  + ['enable', 'disable', 'true', 'false', 'enab', 'disab', 'tru', 'fa'].join('\n') + ' ```');

	await BOT.dbCommands.setSpamFilterEnabled(BOT.database, msg.guild.id, thing);
	BOT._refreshMod('message-processors');
	msg.channel.send('Spamfilter is now ' + (to ? 'enabled': 'disabled') + ' on this guild.\nEffects will appear in a few seconds.');
};

module.exports.about = {
	'command': 'set-spamfilter',
	'description': '__Enables__ or __Disables__ the spamfilter for the current guild.',
	'examples': ['set-spamfilter true', 'set-spamfilter false', 'set-spamfilter enable'],
	'discord': true,
	'terminal': false,
	'list': true,
	'listTerminal': false,
	'aliases': 'ssf',
	'onlyMasterUsers': true
};