/*
    Yuno Gasai. A Discord.JS based bot, with multiple features.
    Copyright (C) 2018 Maeeen <maeeennn@gmail.com>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see https://www.gnu.org/licenses/.
*/

let {MessageEmbed} = require('discord.js'),
	embedColor = '#ff7ab3';

let DISCORD_EVENTED = false,
	DBCmds,
	discord,
	jdmmsg,
	jdmmsgt;

module.exports.modulename = 'join-dm-msg';

let discordConnected = async function(Yuno) {
	DBCmds = Yuno.dbCommands,
	discord = Yuno.dC;
	jdmmsg = await DBCmds.getJoinDMMessages(Yuno.database),
	jdmmsgt = await DBCmds.getJoinDMMessagesTitles(Yuno.database);

	eventDiscord();
};

let eventDiscord = function() {
	if (DISCORD_EVENTED)
		return;

	DISCORD_EVENTED = true;

	discord.on('guildMemberAdd', function(member) {
		let guildId = member.guild.id,
			msg = jdmmsg[guildId],
			msgt = jdmmsgt[guildId];

		let send = false,
			embed = new MessageEmbed().setColor(embedColor);

		if (typeof msgt === 'string' && msgt !== 'null') {
			embed.setTitle(msgt);
			send = true;
		}

		if (typeof msg === 'string' && msg !== 'null') {
			embed.setDescription(msg);
			send = true;
		}

		if (send)
			member.send(embed).catch(error => {
				if (error.code == 50007) {
					console.error('Failed to send message:', error);
				}
			});
	});
};

module.exports.init = function(Yuno, hotReloaded) {
	if (hotReloaded)
		discordConnected(Yuno);
	else
		Yuno.on('discord-connected', discordConnected);
};

module.exports.configLoaded = function() {};
