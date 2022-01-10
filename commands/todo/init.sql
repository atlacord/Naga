BEGIN TRANSACTION;
--DROP TABLE IF EXISTS config;
CREATE TABLE IF NOT EXISTS config (
	guild_id TEXT NOT NULL,
	key TEXT NOT NULL,
	value TEXT,
	UNIQUE(guild_id, key)
);
--DROP TABLE IF EXISTS birthdays;
CREATE TABLE IF NOT EXISTS birthdays (
	guild_id TEXT NOT NULL,
	user_id TEXT NOT NULL,
	year INTEGER,
	month INTEGER NOT NULL,
	day	INTEGER NOT NULL,
	UNIQUE(guild_id, user_id)
);
COMMIT;