module.exports.modulename = 'presence';

let presenceData = null;

let discordConnected = async function(Yuno) {
	if (presenceData !== null)
		Yuno.dC.user.setPresence(presenceData);
};

module.exports.init = function(Yuno, hotReloaded) {
	if (hotReloaded)
		discordConnected(Yuno);
	else
		Yuno.on('discord-connected', discordConnected);
};

module.exports.configLoaded = async function(Yuno, config) {
	let presenceData_ = await config.get('discord.presence');

	if (typeof presenceData_ === 'object')
		presenceData = presenceData_; 
};