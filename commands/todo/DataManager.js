const dbpath = "../schemas/birthdays.db"
const db = require('better-sqlite3')(dbpath, {verbose: console.log});
process.on("exit", () => db.close());

if (!db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'config';").get()) {
	db.exec(require("fs").readFileSync("../schemas/init.sql", "utf8"));
}

const GuildConfig = (function() {
	const cache = {};
	db.prepare("SELECT guild_id, key, value FROM config;").all().forEach((row) => {
		if (cache[row.guild_id] === undefined) cache[row.guild_id] = {};
		cache[row.guild_id][row.key] = row.value;
	});

	function get(guild_id, key) {
		if (cache[guild_id] === undefined) cache[guild_id] = {};
		return cache[guild_id][key];
	}
	function set(guild_id, key, value) {
		if (cache[guild_id] === undefined) cache[guild_id] = {};
		let changes = 0;
		if (value !== undefined) {
			if (db.prepare("SELECT 1 FROM config WHERE (guild_id, key) = (?, ?);").get([guild_id, key])) {
				changes = db.prepare("UPDATE config SET value = ? WHERE (guild_id, key) = (?, ?);").run([value, guild_id, key]);
			} else {
				changes = db.prepare("INSERT INTO config (guild_id, key, value) VALUES (?, ?, ?);").run([guild_id, key, value]);
			}
		} else {
			changes = db.prepare("DELETE FROM config WHERE (guild_id, key) = (?, ?);").run([guild_id, key]);
		}
		if (changes) cache[guild_id][key] = value;
		return changes;
	}
	return {
		get,
		set
	}
})();

const Birthdays = (function() {
	function getUsersByBirthday(guild_id, day, month) {
		return db.prepare("SELECT user_id, year FROM birthdays WHERE (guild_id, day, month) = (?, ?, ?);").all([guild_id, day, month]);
	}
	function setUserBirthday(guild_id, user_id, day, month, year) {
		if (db.prepare("SELECT 1 FROM birthdays WHERE (guild_id, user_id) = (?, ?);").get([guild_id, user_id])) {
			db.prepare("UPDATE birthdays SET day = ?, month = ?, year = ? WHERE (guild_id, user_id) = (?, ?);").run([day, month, year, guild_id, user_id]);
		} else {
			db.prepare("INSERT INTO birthdays (guild_id, user_id, day, month, year) VALUES (?, ?, ?, ?, ?);").run([guild_id, user_id, day, month, year]);
		}
	}
	function removeUserBirthday(guild_id, user_id) {
		const info = db.prepare("DELETE FROM birthdays WHERE (guild_id, user_id) = (?, ?);").run([guild_id, user_id]);
		return info.changes;
	}
	function getBirthdays(guild_id) {
		return db.prepare("SELECT user_id, day, month, year FROM birthdays WHERE guild_id = ?;").all([guild_id]);
	}
	return {
		getUsersByBirthday,
		setUserBirthday,
		removeUserBirthday,
		getBirthdays
	}
})();


module.exports = {
	GuildConfig,
	Birthdays
}