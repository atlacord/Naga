import { Client, Guild } from 'discord.js';
import { Collection } from '../Structures';
import Naga from '../';

export default class GuildManager extends Collection {
    public naga: Naga.Naga;
    public client: Client;
    public config: Naga.NagaConfig;
    public _activeThreshold: number;
    public _registering: any;

    constructor(naga: any) {
        super();
        this.naga = naga;
        this.client = naga.client;
        this.config = naga.config;
        this._registering = new Set();
        this._activeThreshold = 3600 * 1000; // 24 hrs
    }

    // Global config
    get globalConfig() {
        return this.naga.globalConfig;
    }

    /**
     * Update a guild's database entry
     * @param id Guild ID
     * @returns 
     */
    public guildUpdate(id: string) {
        if (!this.client.guilds.cache.has(id)) return;
    }

    public getOrFetch(id: string) {
		const doc = this.get(id);
		if (doc) {
			doc.cachedAt = Date.now();
			return Promise.resolve(doc);
		}

		return this.fetch(id).then((doc: any) => {
			if (!doc) {
				return this.registerGuild(this.client.guilds.cache.get(id));
			}

			doc.cachedAt = Date.now();
			this.set(doc._id, doc);

			return doc;
		});
	}

    /**
     * Fetches a guild from the database
     * @param id Guild ID
     * @returns 
     */
    public fetch(id: string) {
        let updateKeys = ['name', 'iconURL', 'ownerID', 'memberCount'];
        return new Promise<void>((resolve, reject) => {
            this.naga.models.Server.findAndPopulate(id).then((doc: any) => {
                if (!doc) return resolve();
                doc = doc.toObject();
                let update: any = false;

                if (this.client.guilds.cache.has(id)) {
                    const guild = this.naga.guilds.cache.get(id);

                    if (!doc.longId) {
                        update = update || {};
                        update.longId = guild.id;
                    };

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

                    if (!doc.lastActive || (Date.now() - doc.lastActive) > this._activeThreshold) {
                        update = update || {};
                        update.lastActive = Date.now();
                        this.setActive(guild, update.lastActive);
                    }

                    if (update) {
                        this.update(id, { $set: update }).catch((err: Error) => this.naga.logger.error(err));
                    }
                }
                this.set(doc._id, doc);
                return resolve(doc);
            }).catch((err: Error) => reject(err));
        });
    }

    setActive(guild: any, time: Date) {
		guild.lastActive = time;
		this.naga.redis.hset(`guild_activity:${this.config.client.id}:${this.config.client.options.maxShards}:${guild.shard.id}`, guild.id, time)
			.catch((): any => null);
	}

    /**
	 * Guild created event listener
	 * @param {Guild} guild Guild object
	 */
	async guildCreated(guild: Guild) {
		this.naga.logger.info(`Connected to guild: ${guild.id} with ${guild.channels.cache.size} channels and ${guild.members.cache.size} members | ${guild.name}`);

		try {
			var doc = await this.naga.models.Server.findOne({ _id: guild.id }).lean().exec();
			if (!doc) {
				return this.registerGuild(guild);
			}

			await this.update(guild.id, { $set: { deleted: false } }, { multi: true });
			this.set(doc._id, doc);
		} catch (err) {
			return this.naga.logger.error(err);
		}
		return false;
	}

    /**
	 * Guild deleted event listener
	 * @param  {Guild} guild Guild object
	 */
	async guildDeleted(guild: Guild) {
		if (!guild.available) return;

		this.update(guild.id, { $set: { deleted: true, deletedAt: new Date() } })
			.catch((err: Error) => this.naga.logger.error(err));
	}

    /**
     * Loads a guild into the database
     * @param guild Guild object
     * @returns 
     */
    public registerGuild(guild: Guild) {
        console.log('hi')
        if (!guild) return;

        let doc: any = {
            _id: guild.id,
            clientID: this.config.client.id,
            name: guild.name,
            iconURL: guild.iconURL,
            ownerID: guild.ownerId,
            memberCount: guild.memberCount,
            modules: {},
            commands: {},
            lastActive: Date.now()
        };

        this.naga.logger.info(`Registering guild ${guild.name} (${guild.id})`);

        return new Promise((resolve, reject) => {
            for (let module of this.naga.modules.values()) {
                if (module.core && (module.hasOwnProperty('list') && module.list === false)) continue;
                doc.modules[module.module] = module.enabled;
            }

            for (let command of this.naga.commands.values()) {
                if (command.permissions === 'admin') continue;

                if (this.naga.modules.find((c: Naga.Command) => c.module === command.group) && doc.modules[command.group] === false) {
                    doc.commands[command.name] = false;
                    continue;
                }

                doc.commands[command.name] = (command.enabled || !command.disabled);
            }

            // update method implementation
        })
    }

    /**
     * Update a guild
     * @param id Guild ID
     * @param update 
     * @param args Args
     * @returns 
     */
	public update(id: string, update: any, ...args: any[]) {
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
				serverlistColl.update({ id }, { $set: serverlistUpdate });
			}

			if (update.$set.deleted === false) {
				serverlistColl.update({ id }, { $unset: { markedForDeletionAt: 1 } });
			}
		}

		try {
			const result = this.naga.models.Server.update({ _id: id }, update, ...args);
			this.naga.redis.publish('guildConfig', id);
			return result;
		} catch (err) {
			this.naga.logger.error(err);
		}
	}
}