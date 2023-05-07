const sqlite = require('sqlite3');

let instance = null;

/**
 * A sqlite3 database.
 * @constructor
 * @singleton
 */
let Database = function() {
	this.db = null;
};

/**
 * Opens a file as a sqlite3 database.
 * @param {String} file Path to the database.
 * @return {Promise}
 * @async
 */
Database.prototype.open = function(file) {
	return new Promise((function(resolve, reject) {
		this.db = new sqlite.Database(file, (function(err) {
			if (err)
				reject(new Error('Impossible to connect to the database ' + file + '. ' + err.message));
			resolve(this);
		}).bind(this));
	}).bind(this));
};

/**
 * Runs a SQL command
 * @throws {Error} When method is triggered but the db is not opened.
 * @param {String} sqlCommand
 * @param {array|Object} [param] The ? and $value in the SQL command. See https://github.com/mapbox/node-sqlite3/wiki/API#databaserunsql-param--callback
 * @param {function(e)?} [callback] Error is null on success, otherwise, it contains the error
 */
Database.prototype.run = function(sqlCommand, param, callback) {
	if (this.db === null)
		throw new Error('Tryied to access database, but not opened!');
	return this.db.run(sqlCommand, param, callback);
};

/**
 * Runs a SQL command but returns a Promise instead of {@link Database.prototype.run}
 * @throws {Error} When method is triggered but the db is not opened.
 * @param {String} sqlCommand
 * @param {array|Object} [param] The ? and $value in the SQL command. See https://github.com/mapbox/node-sqlite3/wiki/API#databaserunsql-param--callback
 * @returns {Promise}
 */
Database.prototype.runPromise = function(sqlCommand, param) {
	if (this.db === null)
		throw new Error('Tryied to access database, but not opened!');
	return new Promise((function(resolve, reject) {
		this.run(sqlCommand, param, (function(err) {
			if (err)
				reject(err);
			else
				resolve();
		}));
	}).bind(this));
};

/**
 * Retriggers callback for every row returned by the SQL command
 * @throws {Error} When method is triggered but the db is not opened.
 * @param {String} sql The SQL command
 * @param {array|Object} [param] The placeholders.
 * @param {function(err, row)} [callback] Called at every row.
 * @param {function} [complete] Executed when the iteration is done.
 */
Database.prototype.each = function(sql, param, callback, complete) {
	if (this.db === null)
		throw new Error('Tryied to access database, but not opened!');
	return this.db.each(sql, param, callback, complete);
};

/**
 * Executes a SQL command and returns the given rows :
 * Triggers callback with all returned row of the SQL Command.
 * @throws {Error} When method is triggered but the db is not opened.
 * @param {String} sql The SQL command
 * @param {array|Object} [param] The placeholders.
 * @param {function(err, rows)} [callback]
 */
Database.prototype.all = function(sql, param, callback) {
	if (this.db === null)
		throw new Error('Tryied to access database, but not opened!');
	return this.db.all(sql, param, callback);
};

/**
 * Executes a SQL command and returns the given rows through the callback and the Promise's onfulfilled
 * @throws {Error} When method is triggered but the db is not opened.
 * @param {String} sql The SQL command
 * @param {array|Object} [param] The placeholders.
 * @return {Promise} onfulfilled(err|rows)
 */
Database.prototype.allPromise = function(sql, param) {
	if (this.db === null)
		throw new Error('Tryied to access database, but not opened!');
	return new Promise((function(resolve, reject) {
		this.db.all(sql, param, function(err, rows) {
			if (err)
				reject(err);
			else
				resolve(rows);
		});
	}).bind(this));
};

/**
 * Close the database.
 */
Database.prototype.close = function(callback) {
	if (this.db === null)
		return callback();

	let callback_ = (function() {
		this.db = null;
		return callback();
	}).bind(this);

	return this.db.close(callback_);
};

/**
 * Close the database but with a promise.
 */
Database.prototype.closePromise = function() {
	if (this.db === null);
	return;

	return new Promise((function(resolve, reject) {
		this.db.close((function() {
			resolve();
		}));
	}).bind(this));
};

module.exports = Database;
