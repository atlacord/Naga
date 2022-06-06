const { Collection } = require('axoncore');
const { models } = require('../Models');

/**
 * @class GuildCollection
 * @extends Collection
 */
class GuildCollection extends Collection {
    /**
     * A collection of guild configs
     * @param {Object} config
     * @param {Client} client
     */
    constructor(config, client) {
        super();

        this.bot = client;
    }

    guildUpdate(id) {
		if (!this.bot.guilds.has(id) || !this.has(id)) {
			return;
		}

		this.fetch(id).catch(err => logger.error(err));
    }
    
    getOrFetch(id) {
		const doc = this.get(id);
		if (doc) {
			doc.cachedAt = Date.now();
			return Promise.resolve(doc);
		}

		return this.fetch(id).then(doc => {
			if (!doc) {
				return this.registerGuild(this.bot.guilds.get(id));
			}

			doc.cachedAt = Date.now();
			this.set(doc._id, doc);

			return doc;
		});
    }
    
    fetch(id) {
		let updateKeys = ['name', 'region', 'iconURL', 'ownerID', 'memberCount'];
		return new Promise((resolve, reject) => {
			models.Guild.findAndPopulate(id)
				.then(doc => {
					if (!doc) {
						return resolve();
					}

					doc = doc.toObject();
					let update = false;

					if (this.bot.guilds.has(id)) {
						const guild = this.bot.guilds.get(id);

						if (!doc.longId) {
							update = update || {};
							update.longId = guild.id;
						}

						for (let key of updateKeys) {
							if (guild[key] && doc[key] !== guild[key]) {
								update = update || {};
								update[key] = guild[key];
								doc[key] = guild[key];
							}
						}

						if (doc.deleted === true) {
							update = update || {};
							update.deleted = false;
						}

						if (!doc.clientID || doc.clientID !== this.config.client.id) {
							if ((this.config.isPremium && doc.isPremium) || (!this.config.isPremium && !doc.isPremium)) {
								update = update || {};
								update.clientID = this.config.client.id;
							}
						}

						if (!doc.lastActive || (Date.now() - doc.lastActive) > this._activeThreshold) {
							update = update || {};
							update.lastActive = Date.now();
							this.setActive(guild, update.lastActive);
						}

						if (update) {
							this.update(id, { $set: update }).catch(err => logger.error(err));
						}
					}

					this.set(doc._id, doc);
					return resolve(doc);
				})
				.catch(err => reject(err));
		});
    }
    registerGuild(guild, newGuild) {
		if (!guild || !guild.id) {
			return;
		}

		if (this._registering.has(guild.id)) {
			return;
		}

		this._registering.add(guild.id);

		let doc = {
			_id: guild.id,
			longId: guild.id,
			clientID: this.config.clientID,
			name: guild.name,
			iconURL: guild.iconURL,
			ownerID: guild.ownerID,
			memberCount: guild.memberCount,
			region: guild.region || null,
			modules: {},
			commands: {},
			lastActive: Date.now(),
			deleted: false,
		};

		logger.info(`Registering guild: ${guild.id} ${guild.name}`);

		if (newGuild && !this.config.isPremium) {
			this.dmOwner(guild);
		}

		return new Promise((resolve, reject) => {

			this.update(doc._id, doc, { upsert: true })
				.then(() => {
					doc.cachedAt = Date.now();

					this.set(guild.id, doc);
					return resolve(doc);
				})
				.catch(err => {
					logger.error(err);
					return reject(err);
				})
				.then(() => this._registering.delete(guild.id));
		});
    }
}

module.exports = GuildCollection;