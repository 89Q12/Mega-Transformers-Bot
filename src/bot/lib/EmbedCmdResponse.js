// hot-reload
delete require.cache[require.resolve('../Util')];

const {MessageEmbed} = require('discord.js'),
	Util = require('util'),
	DiscordUtil = require('../Util');


/**
 * Embed Command Response (a nice way to return response from command)
 * @param {Object} data Data to set in the rich embed
 * @extends {MessageEmbed}
 */
let EmbedCmdResponse = function(data) {
	Object.getPrototypeOf(MessageEmbed.prototype).constructor.call(this, data);
};

EmbedCmdResponse.setCMDRequester = function(embed, user) {
	let username = user.nickname ? user.nickname : user.user.tag;
    
	embed.setFooter('Requested by ' + username, DiscordUtil.getAvatarURL(user.user));
	return embed;
};

Util.inherits(EmbedCmdResponse, MessageEmbed);

/**
 * Sets the command requester at the footer.
 * @param {GuildMember} user
 * @return {EmbedCmdResponse} itself.
 * @deprecated
 */
EmbedCmdResponse.prototype.setCMDRequester = function(user) {
	let username = user.nickname ? user.nickname : user.user.tag;
    
	this.setFooter('Requested by ' + username, DiscordUtil.getAvatarURL(user.user));
	return this;
};

/**
 * Sets the description of the footer, but joins the arguments
 * @param {String} description...
 * @return {EmbedCmdResponse} itself.
 * @deprecated
 */
EmbedCmdResponse.prototype.setDescription = function() {
	let things = Array.from(arguments),
		description = '';

	things.forEach(el => description += el + ' ');

	description.substring(0, -1);

	MessageEmbed.prototype.setDescription.call(this, description);
	return this;
};

module.exports = EmbedCmdResponse;