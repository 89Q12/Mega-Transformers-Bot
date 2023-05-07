module.exports.modulename = 'presence';

let presenceData = null;

let discordConnected = async function(BOT) {
	if (presenceData !== null)
		BOT.dC.user.setPresence(presenceData);
};

module.exports.init = function(BOT, hotReloaded) {
	if (hotReloaded)
		discordConnected(BOT);
	else
		BOT.on('discord-connected', discordConnected);
};

module.exports.configLoaded = async function(BOT, config) {
	let presenceData_ = await config.get('discord.presence');

	if (typeof presenceData_ === 'object')
		presenceData = presenceData_; 
};