import * as djs from 'discord.js';
import { GlobalConfig } from '../';
import config from './Config';
import Logger from './Logger';
import { Utils } from '../Structures';

import PermissionsManager from '../Managers/PermissionsManager';
import CommandManager from '../Managers/CommandManager';
import GuildManager from '../Managers/GuildManager';
import ModuleManager from '../Managers/ModuleManager';

import SpiritLibrary from './Database/Database';

var name = 'BotClient';
var nagaConfig = config;

export default class Naga {
    private _client: djs.Client;
    public isReady: boolean;
    public _globalConfig: GlobalConfig;
    public _utils: Utils;
    public _logger: Logger;
    public permissions: PermissionsManager;
    public commands: CommandManager;
    public guilds: GuildManager;
    public modules: ModuleManager;
    public _db: SpiritLibrary;
    public _globalConfigInterval: NodeJS.Timeout;
    public isLoading: any;

    constructor() {
        this.isReady = false;
    }

    // discord.js client
    public get client() {
        return this._client;
    }

    // bot config
    public get config() {
        return config;
    }

    // global config
    public get globalConfig() {
        return this._globalConfig;
    }

    // common utility functions
    public get utils() {
        return this._utils;
    }

    // logger instance
    public get logger() {
        return this._logger;
    }

    // mongo instance
    public get db() {
        return this._db;
    }

    // mongo models
    public get models() {
        return this.db.models;
    }

    /**
     * Initializes the bot client
     * @param opts Client options
     */
    public async setup(opts: djs.ClientOptions) {
        let options: djs.ClientOptions = opts;

        options.allowedMentions = opts.allowedMentions || { parse: [ 'roles'] };
        options.intents = opts.intents || [djs.GatewayIntentBits.Guilds];

        this._db = new SpiritLibrary(this.config.database.uri);
        this._logger = new Logger();
        this._utils = new Utils();

        // Initialize the discord.js client
        this.logger.info('Initializing client', name);
        this._client = new djs.Client(options);

        // Initialize manager classes
        this.permissions = new PermissionsManager(this);
        this.commands = new CommandManager(this);
        this.modules = new ModuleManager(this);
        this.guilds = new GuildManager(this);

        // Event functions
        this.client.once('ready', this.ready.bind(this));
        this.client.on('error', err => this.logger.error(err));

        this.client.guilds.cache.forEach(g => {
            this.loadGuild(g.id);
        })

        await this.loadConfig().catch(() => null);
        await this.watchGlobalConfig();

        // Connect to Discord
        const token = process.env.TOKEN as string;
        await this.login(token);
    }

    /**
     * Loads config from the db
     */
    public async loadConfig(): Promise<void> {
        try {
            this.logger.info('Loading config', name);
            if (this.models.Config != undefined) {
                const dbConfig = await this.models.Config.findOne({ clientId: this.config.client.id }).lean()
                if (dbConfig) {
                    nagaConfig = Object.assign(config, dbConfig);
                }
                this.logger.info('Loading globalConfig', name)
                const globalConfig: GlobalConfig = await this.models.Naga.findOne().lean();
                this._globalConfig = config.global = globalConfig;
            }
        } catch (err) {
            this.logger.error(`Unable to load config: ${err}`, name);
        }
    }

    async watchGlobalConfig() {
		await this.updateGlobalConfig();
		this._globalConfigInterval = setInterval(() => this.updateGlobalConfig(), 2 * 60 * 1000);
	}

    /**
     * Updates the global config db doc
     */
    public async updateGlobalConfig(): Promise<void> {
		try {
            this.logger.info('Updating globalConfig')
			const globalConfig: GlobalConfig = await this.models.Naga.findOne().lean();
			if (globalConfig) {
				this._globalConfig = config.global = globalConfig;
			}
		} catch (err) {
			this.logger.error(`Unable to update globalConfig: ${err}`, name);
		}
	}

    /**
     * Connects to the Discord gateway
     * @param t Bot token
     */
    public async login(t: string): Promise<void> {
        const token = 'Bot ' + t;
        this.logger.info('Connecting to Discord', name);
        await this.client.login(token);
    }

    /**
     * Edits the bot status
     * @param presence Presence object
     */
    public async editStatus(presence: any): Promise<void> {
        let status = { name: 'Testing', type: 0 } || presence;
        await this.client.user?.setPresence({activities: [status] });
    }

    /**
     * Executes when the bot fires the "ready" event
     */
    public async ready(): Promise<void> {
        this.logger.info(`Connected to Discord as ${this.utils.fullName(this.client.user)}`, name);
        this.isReady = true;

        await this.editStatus({name: 'Testing', type: 0})
    }

    public loadGuild(id: string) {

        let g = this.client.guilds.cache.get(id);

        this.guilds.getOrFetch(g.id);
        const p = new Promise(async (res, rej) => {
            try {
                let [guild, channels] = await Promise.all([
                    this.client.guilds.cache.get(id),
                    this.client.guilds.cache.get(id).channels,
                ]);

                guild.channels = channels;

                return res(guild);
            } catch (err) {
                return rej(err);
            }
        });

        this.isLoading.set(id, p);

        setTimeout(() => {
            if (!this.isLoading.has(id)) { return; }
            this.isLoading.delete(id);
        }, 10000);

        return p;
    };
}