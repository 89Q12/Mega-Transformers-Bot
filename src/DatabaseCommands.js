const Database = require('./database');

let self;

let zeroPadding = function(num, places) {
	var zero = places - num.toString().length + 1;
	return Array(+(zero > 0 && zero)).join('0') + num;
};

module.exports = self = {
	/**
     * Upgrades the Yuno's first version database to this version
     * @param {Yuno} Yuno The Yuno instance
     * @param {Prompt} prompt The Prompt
     * @param {String} file
     * @param {String} destination The filename of the destination file.
     * @return {Promise}
     */
	'upgrade': function(Yuno, prompt, file, to) {
		return new Promise((async function(resolve, reject) {
			// still check if the extension is here and remove it
			if (to.indexOf('.db') === -1)
				to += '.db';

			try { fs.unlinkSync(to); } catch(e) {}

			let olddb = await (new Database).open(file),
				olddbVers = await olddb.allPromise('PRAGMA user_version;');
			isItReallyFromV1 = olddbVers instanceof Array,
			newdb = await (new Database).open(to);

			if (!isItReallyFromV1) {
				return yuno.prompt.error('Database isn\'t from Yuno Gasai v1. If it\'s really from v1, why is then a user_version PRAGMA ? :thinking:');
			}

			let experiences = await olddb.allPromise('SELECT * FROM exp'),
				guilds = await olddb.allPromise('SELECT * FROM guilds');

			await self.initDB(newdb, Yuno, true);

			prompt.info('Exporting experiences... 1/2');

			for(let i = 0; i < experiences.length; i++) {
				let el = experiences[i];
				await newdb.runPromise('INSERT INTO experiences VALUES(?, ?, ?, ?)',
					[ el.level, el.userID, el.guildID, el.expCount ]);
				prompt.writeWithoutJumpingLine(i + '/' + experiences.length + ' values inserted into table experiences.');
			}
			prompt.success('Experiences exported...');

			prompt.info('Exporting guild settings... 2/2');
			for(let i = 0; i < guilds.length; i++) {
				let el = experiences[i];
				await newdb.runPromise('INSERT INTO guilds VALUES(?, ?, ?, NULL, true)',
					[ el.guildID, el.prefix, el.joinDMMessage ]);
				prompt.writeWithoutJumpingLine(zeroPadding(i, experiences.length.toString().length) + '/' + experiences.length + ' values inserted into table guild settings.');
			}
			prompt.success('Guild settings exported');

			await newdb.closePromise();
			prompt.success('The database has been updated!');

			resolve();
		}));
	},

	/**
     * Inits the tables of a new database.
     * @param {Database} database
     * @param {Yuno} Yuno Yuno's instance.
     * @param {boolean} newDb Representing if the DB was just created.
     * @async
     */
	'initDB': async function(database, Yuno, newDb) {
		let version = await database.allPromise('PRAGMA user_version;'),
			dbVer = version[0]['user_version'];

		if (dbVer < Yuno.intVersion && !newDb) {
			Yuno.prompt.info('The database isn\'t at the good version for the bot. (Yuno\'s version: ' + Yuno.intVersion + '; dbvers: ' + dbVer + '). Expect errors, and report them.');
			if (dbVer === 0) {
				Yuno.prompt.error('The database isn\'t for the Yuno\'s v2 version. Please update the db, see node index -h to upgrade it.');
				return Yuno.shutdown(-1);
			}
		}

		await database.runPromise('PRAGMA user_version = ' + Yuno.intVersion);

		await database.runPromise(`CREATE TABLE IF NOT EXISTS experiences (
            level INTEGER,
            userID STRING,
            guildID STRING,
            exp INTEGER
        )`);
		/*
            id = the guild id
            prefix = the prefix triggering commands
            onJoinDMMsg = the message sent to new users
            onJoinDMMsgTitle = the title of the msg sent to new users
        */
		await database.runPromise(`CREATE TABLE IF NOT EXISTS guilds (
            id TEXT,
            prefix VARCHAR(5),
            onJoinDMMsg TEXT,
            onJoinDMMsgTitle VARCHAR(255),
            spamFilter BOOL,
            measureXP BOOL,
            levelRoleMap TEXT
        )`);
		/*
            gid = the guild id
            cname = the channel's name
            cleantime = the nb of hours between each clean
            warningtime = the nb of minutes before the clean to warn
            remainingtime = remaining time before clean in minute (updated every minute)
        */
		await database.runPromise(`CREATE TABLE IF NOT EXISTS channelcleans (
           gid TEXT,
           cname TEXT,
           cleantime INTEGER,
           warningtime INTEGER,
           remainingtime TEXT
        )`);
		/*
            id = index
            gid = the guild id
            trigger
            response
            image
        */
		await database.runPromise(`CREATE TABLE IF NOT EXISTS mentionResponses (
            id INTEGER PRIMARY KEY, 
            gid TEXT,
            trigger TEXT,
            response TEXT,
            image TEXT
        )`);
		/*
         * gid = guild id
         * banner = user id of the banner
         * image = image url
         */
		await database.runPromise(`CREATE TABLE IF NOT EXISTS banImages (
            gid TEXT,
            banner TEXT,
            image TEXT
        )`);
	},

	/**
     * Inits a guild in the database. (if it's not recorded in the db.)
     * @param {Database} database
     * @param {String} guildid
     * @async
     */
	'initGuild': async function(database, guildid) {
		let exists = await database.allPromise(`SELECT * FROM guilds WHERE id='${guildid}'`);
		if (exists.length === 0)
			await database.runPromise(`INSERT INTO guilds(id) VALUES(${guildid})`);
	},

	/**
     * Returns the prefixes of all guilds in an object
     * @param {Database} database
     * @async
     * @return {Object}
     */
	'getPrefixes': async function(database) {
		let guilds = await database.allPromise('SELECT id, prefix FROM guilds'),
			finalObj = {};

		guilds.forEach(el => finalObj[el.id] = el.prefix);

		return finalObj;
	},

	/**
     * Sets the prefix for a guild (from its guild id)
     * @param {Database} database
     * @param {String} guildid
     * @param {String} prefix
     * @async
     */
	'setPrefix': async function(database, guildid, prefix) {
		await self.initGuild(database, guildid);
		await database.runPromise('UPDATE guilds SET prefix=\'' + prefix + '\' WHERE id=\'' + guildid + '\'');
	},

	/**
     * Returns the messages to send via DM to users.
     * @param {Database} database
     * @async
     * @return {Object}
     */
	'getJoinDMMessages': async function(database) {
		let messages = await database.allPromise('SELECT id, onJoinDMMsg FROM guilds'),
			finalObj = {};

		messages.forEach(el => finalObj[el.id] = el.onJoinDMMsg);

		return finalObj;
	},

	/**
     * Sets the DM Message for a user joins for a guild (from its guild id)
     * @param {Database} database
     * @param {String} guildid
     * @param {String} message
     * @async
     */
	'setJoinDMMessage': async function(database, guildid, message) {
		await self.initGuild(database, guildid);
		await database.runPromise('UPDATE guilds SET onJoinDMMsg=\'' + message + '\' WHERE id=\'' + guildid + '\'');
	},

	/**
     * Returns the title of the messages to send via DM to users.
     * @param {Database} database
     * @async
     * @return {Object}
     */
	'getJoinDMMessagesTitles': async function(database) {
		let messages = await database.allPromise('SELECT id, onJoinDMMsgTitle FROM guilds'),
			finalObj = {};

		messages.forEach(el => finalObj[el.id] = el.onJoinDMMsgTitle);

		return finalObj;
	},

	/**
     * Sets the DM Message's title for a user joins for a guild (from its guild id)
     * @param {Database} database
     * @param {String} guildid
     * @param {String} messageTitle
     * @async
     */
	'setJoinDMMessageTitle': async function(database, guildid, messageTitle) {
		await self.initGuild(database, guildid);
		await database.runPromise('UPDATE guilds SET onJoinDMMsgTitle=\'' + messageTitle + '\' WHERE id=\'' + guildid + '\'');
	},

	/**
     * Returns an object, as key guild ids, and as value a boolean value to say if the spam filter is enabled.
     * @param {Database} database
     * @async
     * @return {Object}
     */
	'getSpamFilterEnabled': async function(database) {
		let spam = await database.allPromise('SELECT id, spamFilter FROM guilds'),
			finalObj = {};

		spam.forEach(el => finalObj[el.id] = el.spamFilter);

		return finalObj;
	},

	/**
     * Enable/Disable spam filter for a guild (from its guildid)
     * @param {Database} database
     * @param {String} guildid
     * @param {String} spamFilter
     * @async
     */
	'setSpamFilterEnabled': async function(database, guildid, spamFilter) {
		await self.initGuild(database, guildid);
		await database.runPromise('UPDATE guilds SET spamFilter=\'' + spamFilter + '\' WHERE id=\'' + guildid + '\'');
	},

	/**
     * Returns an array, with all guilds with exp counting is enabled.
     * @param {Database} database
     * @async
     * @return {Object}
     */
	'getGuildsWhereExpIsEnabled': async function(database) {
		let sql = await database.allPromise('SELECT id, measureXP FROM guilds'),
			arr = [];

		sql.forEach(el => {
			if (el.measureXP === 'true' || el.measureXP === true)
				arr.push(el.id);
		});

		return arr;
	},

	/**
     * Enable/Disable xp for a guild (from its guildid)
     * @param {Database} database
     * @param {String} guildid
     * @param {String} xpen
     * @async
     */
	'setXPEnabled': async function(database, guildid, xpen) {
		await self.initGuild(database, guildid);
		await database.runPromise('UPDATE guilds SET measureXP=\'' + xpen + '\' WHERE id=\'' + guildid + '\'');
	},

	/**
     * Returns the level role map of a guild from its guildid
     * @param {Database} database
     * @param {String} guildid
     * @async
     * @return {Object}
     */
	'getLevelRoleMap': async function(database, guildid) {
		let sql = await database.allPromise('SELECT levelRoleMap FROM guilds WHERE id = ?;', [guildid]);

		if (sql[0]['levelRoleMap'] === null)
			return null;

		return JSON.parse(sql[0]['levelRoleMap']);
	},

	/**
     * Enable/Disable xp for a guild (from its guildid)
     * @param {Database} database
     * @param {String} guildid
     * @param {String|Object} rolemap
     * @async
     */
	'setLevelRoleMap': async function(database, guildid, rolemap) {
		if (typeof rolemap === 'object')
			rolemap = JSON.stringify(rolemap);

		await self.initGuild(database, guildid);
		await database.runPromise('UPDATE guilds SET levelRoleMap=\'' + rolemap + '\' WHERE id=\'' + guildid + '\'');
	},

	/**
     * Returns XP data of a user by its id and guilds's id.
     * Creates the entry if inexistant.
     * @param {Database} database
     * @param {String} guildid
     * @param {String} userid
     * @async
     * @return {Object}
     */
	'getXPData': async function(database, guildid, userid) {
		let sql = await database.allPromise('SELECT level, exp FROM experiences WHERE userID = ? AND guildID = ?', [userid, guildid]);

		if (!sql || sql.length === 0) {
			await database.runPromise('INSERT INTO experiences (level, userID, guildID, exp) VALUES(?,?,?,?)',
				[0, userid, guildid, 0]);
			return {
				'xp': 0,
				'level': 0
			};
		}

		let ret = sql[0];

		return {
			'xp': parseInt(ret.exp),
			'level': parseInt(ret.level)
		};
	},

	/**
     * Sets XP data.
     * @param {Database} database
     * @param {String} guildid
     * @param {String} userid
     * @param {number} xp
     * @param {number} level
     * @async
     */
	'setXPData': async function(database, guildid, userid, xp, level) {
		return await database.runPromise('UPDATE experiences SET level = ?, exp = ? WHERE guildid = ? AND userid = ?',
			[level, xp, guildid, userid]);
	},

	/**
     * Returns the cleans in the database
     * @param {Database} database
     * @async
     * @return {array} For each el., an object containing for each value string: guildid, channelid, timeFEachClean, timeBeforeClean 
     */
	'getCleans': async function(database) {
		let cleans = await database.allPromise('SELECT * FROM channelcleans'),
			finalObj = [];

		cleans.forEach(el => {
			finalObj.push({
				'guildId': el.gid,
				'channelName': el.cname,
				'timeFEachClean': parseInt(el.cleantime),
				'timeBeforeClean': parseInt(el.warningtime),
				'remainingTime': parseInt(el.remainingtime)
			});
		});

		return finalObj;
	},

	/**
     * Get a wanted clean
     * @param {Database} database
     * @param {String} guildid
     * @param {String} channelname
     * @async
     * @return {Object|null} as a value from .getCleans
     */
	'getClean': async function(database, guildid, channelname) {
		let clean = await database.allPromise('SELECT * FROM channelcleans WHERE gid = ? AND cname = ?', [guildid, channelname]);

		clean = clean[0];
		if (typeof clean !== 'object')
			return null;
		return {
			'guildId': guildid,
			'channelName': clean.cname,
			'timeFEachClean': parseInt(clean.cleantime),
			'timeBeforeClean': parseInt(clean.warningtime),
			'remainingTime': parseInt(clean.remainingtime)
		};
	},

	/**
     * Creates/Edits a clean entry in the database 
     * @param {Database} database
     * @param {String} guildid
     * @param {String} channelname
     * @param {String|number} timeFEachClean Time between the cleans
     * @param {String|number} timeBeforeClean The warn sent before this number of minutes before the clean
     * @param {String|number|null} remainingTime The remaining time for the clean in seconds
     * @async
     * @returns {array} The first element is whether "creating" or "updating": creating if the rule has been created, updating whether it was updated.
     * The second is the database return.
     */
	'setClean': async function(database, guildid, channelname, timeFEachClean, timeBeforeClean, remainingTime) {
		await self.initGuild(database, guildid);
		return new Promise(async resolve => {
			if (typeof guildid !== 'string' || typeof channelname !== 'string')
				return;

			if (typeof timeFEachClean === 'string')
				timeFEachClean = parseInt(timeFEachClean);

			if (typeof timeBeforeClean === 'string')
				timeBeforeClean = parseInt(timeBeforeClean);

			if (typeof remainingTime === 'string')
				remainingTime = parseInt(remainingTime);

			if (remainingTime > timeFEachClean * 60)
				remainingTime = timeFEachClean;

			if (remainingTime === null)
				remainingTime = timeFEachClean * 60;

			if (isNaN(timeFEachClean) || isNaN(timeBeforeClean))
				resolve();

			let entry = await database.allPromise('SELECT cleantime FROM channelcleans WHERE gid = ? AND cname = ?;', [guildid, channelname]);

			if (entry.length === 0)
				resolve(['creating', await database.runPromise('INSERT INTO channelcleans(gid, cname, cleantime, warningtime, remainingtime) VALUES(?, ?, ?, ?, ?);', [guildid, channelname, timeFEachClean, timeBeforeClean, remainingTime])]);
			else
				resolve(['updating', await database.runPromise('UPDATE channelcleans SET cleantime = ?, warningtime = ?, remainingtime = ? WHERE gid = ? AND cname = ?;', [timeFEachClean, timeBeforeClean, remainingTime.toString(), guildid, channelname])]);
		});
	},

	/**
     * Deletes an auto-clean
     * @param {Database} database
     * @param {String} guildid
     * @param {String} channelname
     * @async
     */
	'delClean': async function(database, guildid, channelname) {
		await self.initGuild(database, guildid);
		await database.runPromise('DELETE FROM channelcleans WHERE gid = ? AND cname = ?;', [guildid, channelname]);
	},

	/**
     * Adds a mention response
     * @param {Database} database
     * @param {String} guildid
     * @param {String} trigger
     * @param {String} response
     * @param {String} image
     */
	'addMentionResponses': async function(database, guildid, trigger, response, image) {
		if (typeof image !== 'string')
			image = 'null';

		await self.initGuild(database, guildid);
		return await database.runPromise('INSERT INTO mentionResponses(id, gid, trigger, response, image) VALUES(null, ?, ?, ?, ?)', [guildid, trigger, response, image]);
	},

	/**
     * Returns all the mentions responses in an array containing objects (id, guildId, trigger, response, image)
     * @param {Database} database
     * @async
     */
	'getMentionResponses': async function(database) {
		let mentionResponses = await database.allPromise('SELECT * FROM mentionResponses'),
			r = [];

		mentionResponses.forEach(el => {
			r.push({
				'id': el.id,
				'guildId': el.gid,
				'trigger': el.trigger,
				'response': el.response,
				'image': el.image
			});
		});

		return r;
	},

	/**
     * Return a mention response from trigger
     * @param {Database} database
     * @param {String} guildid
     * @param {String} trigger
     * @async
     */
	'getMentionResponseFromTrigger': async function(database, guildid, trigger) {
		let mentionResponse = (await database.allPromise('SELECT * FROM mentionResponses WHERE gid = ? AND trigger = ?', [guildid, trigger]))[0];

		if (typeof mentionResponse === 'undefined')
			return null;
		else
			return {
				'id': mentionResponse.id,
				'guildId': mentionResponse.gid,
				'trigger': mentionResponse.trigger,
				'response': mentionResponse.response,
				'image': mentionResponse.image
			};
	},

	/**
     * Deletes a mention response
     * @param {Database} database
     * @param {number} id
     */
	'delMentionResponse': async function(database, id) {
		return await database.runPromise('DELETE FROM mentionResponses WHERE id = ?;', [id]);
	},

	/**
     * Sets the ban image for a banner
     * @param {Database} database
     * @param {String} guildid
     * @param {String} bannerid
     * @param {String} imageurl
     * @async
     * @return Array containing first "creating"/"updating" and as second element the database return
     */
	'setBanImage': async function(database, guildid, bannerid, imageurl) {
		await self.initGuild(database, guildid);
		let entry = await database.allPromise('SELECT image FROM banImages WHERE gid = ? AND banner = ?;', [guildid, bannerid]);

		if (entry.length === 0) {
			let dbr = await database.runPromise('INSERT INTO banImages(gid, banner, image) VALUES(?, ?, ?);', [guildid, bannerid, imageurl]);
			return ['creating', dbr];
		} else {
			let dbr = await database.runPromise('UPDATE banImages SET image = ? WHERE gid = ? AND banner = ?;', [imageurl, guildid, bannerid]);
			return ['updating', dbr];
		}
	},

	/**
     * Returns the image of the banner id
     * @param {Database} database
     * @param {String} guildid
     * @param {String} bannerid
     * @async
     * @return {null|String}
     */
	'getBanImage': async function(database, guildid, bannerid) {
		await self.initGuild(database, guildid);

		let result = await database.allPromise('SELECT * FROM banImages WHERE gid = ? AND banner = ?', [guildid, bannerid]);

		if (result.length === 0)
			return null;

		return result[0].image;
	},

	/**
     * Deletes the ban image (causing the default image to appear when banning)
     * @param {Database} database
     * @param {String} guildid
     * @param {String} bannerid
     * @async
     */
	'delBanImage': async function(database, guildid, bannerid) {
		return await database.runPromise('DELETE FROM banImages WHERE gid = ? AND banner = ?;', [guildid, bannerid]);
	}
};
