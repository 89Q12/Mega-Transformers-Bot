const FAIL_COLOR = '#ff0000';
const SUCCESS_COLOR = '#43cc24';

// hot-reload things
delete require.cache[require.resolve('../lib/EmbedCmdResponse')];

let EmbedCmdResponse = require('../lib/EmbedCmdResponse');

const {GuildMember, MessageMentions} = require('discord.js');

module.exports.run = async function(BOT, author, args, msg) {
	args = args.join(' ');

	let reason = '',
		toBanIds = [],
		mutli;

	if (args.includes('|')) {
		reason = (args.split('|')[1] + ' / Unbanned by ' + msg.author.tag).trim();
		args = args.split('|')[0];
	} else {
		reason = 'Unbanned by ' + msg.author.tag;
	}

	let toBanThings = args.split(' ');

	toBanThings.forEach(function(e) {
		if (!MessageMentions.USERS_PATTERN.test(e)) {
			msg.guild.members.unban(e, reason).then(function() {
				msg.channel.send(new EmbedCmdResponse()
					.setColor(SUCCESS_COLOR)
					.setTitle(':white_check_mark: Unban successful.')
					.setDescription(':arrow_right: User with id', e, 'has been successfully unbanned.')
					.setCMDRequester(msg.member));
			}).catch(function(err) {
				msg.channel.send(new EmbedCmdResponse()
					.setColor(FAIL_COLOR)
					.setTitle(':negative_squared_cross_mark: Unban failed.')
					.setDescription(':arrow_right: Failed to unban', e, ':', err.message)
					.setCMDRequester(msg.member));
			});
		}
	});
};

module.exports.about = {
	'command': 'unban',
	'description': 'Unbans an user',
	'usage': 'unban <@user-mention | id>',
	'examples': ['unban @someone [anotherid] | reason'],
	'discord': true,
	'terminal': false,
	'list': true,
	'listTerminal': false,
	'requiredPermissions': ['BAN_MEMBERS']
};