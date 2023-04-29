'use strict';

import { dot } from 'dot-object';
import * as eris from 'eris';
import each from 'async-each';
import { Collection, Utils } from '../structures/index';
import axios from 'axios';
import redis from '../../core/Redis';
const logger = require('../logger');
import Naga from '../../core/Naga';

/**
 * @class GuildCollection
 * @extends Collection
 */
class GuildCollection extends Collection {

	config: any;
	naga: Naga;
	client: any;
	_registering: Set<any>;
	_activeThreshold: number;
	subRedis: any;

	constructor(config, naga) {
		super();

		this.naga = naga;
		this.client = naga.client;
		this.config = config;
		this._registering = new Set();
		this._activeThreshold = 3600 * 1000; // 24 hrs

		naga.dispatcher.registerListener('guildCreate', this.guildCreated.bind(this));
		naga.dispatcher.registerListener('guildDelete', this.guildDeleted.bind(this));

		this.createWatch();

		setInterval(this.uncacheData.bind(this), 150000);
	}

	get globalConfig() {
		return this.naga.globalConfig;
	}

	async createWatch() {
		// We need an exclusive connection for publish / subscribe
		this.subRedis = await redis.connect();

		await this.subRedis.subscribe('guildConfig');

		this.subRedis.on('message', (channel, message) => {
			if (channel === 'guildConfig') {
				this.guildUpdate(message);
			}
		});
	}

	guildUpdate(id) {
		if (!this.client.guilds.has(id) || !this.has(id)) {
			return;
		}

		this.fetch(id).catch(err => logger.error(err));
	}

	/**
	 * Uncache guild configs
	 */
	uncacheData() {
		each([...this.values()], guild => {
			if ((Date.now() - guild.cachedAt) > 900) {
				this.delete(guild._id);
			}
		});
	}

	/**
	 * Get or fetch a guild, no async/await for performance reasons
	 * @param {String} id Guild ID
	 * @returns {Promise}
	 */
	getOrFetch(id) {
		const doc = this.get(id);
		if (doc) {
			doc.cachedAt = Date.now();
			return Promise.resolve(doc);
		}

		return this.fetch(id).then((doc: any) => {
			if (!doc) {
				return this.registerGuild(this.client.guilds.get(id));
			}

			doc.cachedAt = Date.now();
			this.set(doc._id, doc);

			return doc;
		});
	}

	/**
	 * Fetch a guild from the database
	 * @param {String} id Guild ID
	 * @returns {Promise}
	 */
	fetch(id) {
		let updateKeys = ['name', 'region', 'iconURL', 'ownerID', 'memberCount'];
		return new Promise((resolve, reject) => {
			this.naga.db.models.Server.findAndPopulate(id)
				.then(doc => {
					if (!doc) {
						return Promise.resolve();
					}

					doc = doc.toObject();
					let update: any = false;

					if (this.client.guilds.has(id)) {
						const guild = this.client.guilds.get(id);

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

	/**
	 * Fired when a web update is received
	 * @param {String} id Guild ID
	 */
	// guildUpdate(id) {
	// 	const guild = this.client.guilds.get(id);
	// 	if (!guild) return;

	// 	logger.debug(`Web update for guild: ${id}`);

	// 	this.fetch(id).catch(err => logger.error(err));
	// }

	/**
	 * Wrapper to update guild config
	 * @param {String} id Guild ID
	 * @param {Object} update Mongoose update query
	 * @param {...*} args Any additional arguments to pass to the model
	 * @returns {Promise}
	 */
	update(id, update, ...args) {
		if (update.$set) {
			const serverlistColl = this.naga.db.collection('serverlist_store');
			let serverlistUpdate: any = false;
			if (update.$set.iconURL) {
				serverlistUpdate = serverlistUpdate || {};
				serverlistUpdate.iconURL = update.$set.iconURL;
			}

			if (update.$set.deleted === true) {
				serverlistUpdate = serverlistUpdate || {};
				serverlistUpdate.markedForDeletionAt = Date.now();
			}

			if (update.$set.name) {
				serverlistUpdate = serverlistUpdate || {};
				serverlistUpdate.name = update.$set.name;
			}

			if (update.$set.memberCount) {
				serverlistUpdate = serverlistUpdate || {};
				serverlistUpdate.memberCount = update.$set.memberCount;
			}

			if (serverlistUpdate) {
				serverlistColl.updateOne({ id }, { $set: serverlistUpdate });
			}

			if (update.$set.deleted === false) {
				serverlistColl.updateOne({ id }, { $unset: { markedForDeletionAt: 1 } });
			}
		}

		try {
			const result = this.naga.db.models.Server.updateOne({ _id: id }, update, ...args);
			this.naga.redis.publish('guildConfig', id);
			return result;
		} catch (err) {
			logger.error(err);
		}
	}

	/**
	 * Guild created event listener
	 * @param {Guild} guild Guild object
	 */
	async guildCreated(guild) {
		logger.info(`Connected to server: ${guild.id} with ${guild.channels.size} channels and ${guild.members.size} members | ${guild.name}`);

		try {
			var doc = await this.naga.db.models.Server.findOne({ _id: guild.id }).lean().exec();
			if (!doc) {
				return this.registerGuild(guild);
			}

			await this.update(guild.id, { $set: { deleted: false } }, { multi: true });
			this.set(doc._id, doc);
		} catch (err) {
			return logger.error(err);
		}

		return false;
	}

	/**
	 * Guild deleted event listener
	 * @param  {Guild} guild Guild object
	 */
	async guildDeleted(guild) {
		if (guild.unavailable) return;

		this.update(guild.id, { $set: { deleted: true, deletedAt: new Date() } })
			.catch(err => logger.error(err));
	}

	/**
	 * Register server in the database
	 * @param  {Guild} guild Guild object
	 */
	registerGuild(guild: eris.Guild) {
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
			modules: {},
			commands: {},
			lastActive: Date.now(),
			cachedAt: Date.now(),
			deleted: false,
		};

		logger.info(`Registering guild: ${guild.id} ${guild.name}`);

		return new Promise((resolve, reject) => {
			// add modules
			for (let mod of this.naga.modules.values()) {
				// ignore core modules or modules that shouldn't be listed
				if (mod.core && (mod.hasOwnProperty('list') && mod.list === false)) continue;
				doc.modules[mod.module] = mod.enabled;
			}

			for (let cmd of this.naga.commands.values()) {
				if (cmd.permissions === 'admin') continue;

				// ignore commands that belong to a module
				if (this.naga.modules.find(o => o.module === cmd.group) && doc.modules[cmd.group] === false) {
					doc.commands[cmd.name] = false;
					continue;
				}
				doc.commands[cmd.name] = (cmd.enabled || !cmd.disabled);
			}

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

	setActive(guild, time) {
		guild.lastActive = time;
		this.naga.redis.hset(`guild_activity:${this.config.client.id}:${this.config.clientOptions.maxShards}:${guild.shard.id}`, guild.id, time)
			.catch(() => null);
	}

	/**
	 * Attempt to send a DM to guild owner
	 * @param {Guild} guild Guild object
	 * @param {String} content Message to send
	 * @returns {Promise}
	 */

	postWebhook(webhook, payload) {
		return new Promise((resolve, reject) =>
			axios.post(webhook, {
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				...payload,
			})
			.then(resolve)
			.catch(reject));
	}
}

export = GuildCollection;
