import * as eris from 'eris';
import config from '../config/config';
import EventManager from './managers/EventManager';
import PermissionManager from './managers/PermissionManager';
import ModuleCollection from './collections/Modules';
import CommandCollection from './collections/Commands';
import GuildCollection from './collections/Guilds';
import redis  from './Redis';
import { utils } from './structures/Utils';
import db from './database/index';
const logger = require('./Logger');

let instance: any;

export default class Naga {
    public clientOptions: object;
    public _client: eris.Client;
    public _restClient: eris.Client;
    public isReady: boolean;
    public user: eris.User;
    public userid: string;
    public dispatcher: EventManager;
    public permissions: PermissionManager;
    public modules: ModuleCollection;
    public commands: CommandCollection;
    public guilds: GuildCollection;
    public _globalConfig: any;
    public _redis: any;

    constructor() {
        instance = this;
        this.isReady = false;
    };

    get client() {
        return this._client;
    };

    get logger(): any {
        return logger;
    };

    get restClient() {
        return this._restClient;
    };

    get db() {
        return db;
    };

    get redis() {
		return this._redis;
	}

    get config() {
        return config;
    };

    get globalConfig() {
        return this._globalConfig;
    }

    get utils() {
        return utils;
    }

    async setup(options: object) {
        options = options || {};

        await this.configure(options);
        options = Object.assign({}, options);
        
        this.clientOptions = options;

        let token = config.client.token;

        this._client = new eris.Client(token, this.clientOptions as eris.ClientOptions);
        // this._restClient = new eris.Client(token, options.restClient as eris.ClientOptions);

        this.client.on('error', (err: Error) => { if (err.message.startsWith('Unknown')) return; logger.error(err) });
        this.client.on('warn', (err: Error) => logger.warn (err));
        this.client.on('debug', (msg: string) => {
            if (typeof msg === 'string') {
                msg = msg.replace(config.client.token, 'ur mom');
            }
            logger.debug(`[Eris] ${msg}`);
        });

        this.dispatcher = new EventManager(this);
        this.permissions = new PermissionManager(this);

        this.modules = new ModuleCollection(config, this);
        this.commands = new CommandCollection(config, this);
        this.guilds = new GuildCollection(config, this);

        this.client.once('ready', this.ready.bind(this));
        this.client.on('error', this.handleError.bind(this));

        this.login();
    }

    private async configure(options: object) {
        const clientConfig = {
            disableEveryone: config.client.disableEveryone,
            getAllUsers: config.client.getAllUsers || false,
            messageLimit: config.client.messageLimit || 100,
            allowedMentions: { 
                everyone: false,
                roles: false,
                users: true
            },
            defaultImageSize: 4096,
            defaultImageFormat: 'png',
            intents: config.client.intents
        };

        (config as any).clientOptions = clientConfig;

        return clientConfig;
    };

    login() {
        this.client.connect();
        return false;
    }

    ready() {
        logger.info(`[Naga] Aye-aye, cap'n! ${this.config.name} is ready as ${this.client.user.username}#${this.client.user.discriminator}`);

        this.user = this._client.user;
        this.userid = this._client.user.id;

        this.isReady = true;

        this.client.editStatus({ name: this.config.client.status, type: 0 })
        this.leaveGuilds();
    }

    leaveGuilds() {
        this.client.guilds.forEach(guild => {
            if (!config.testGuilds.includes(guild.id)) {
                logger.info(`[GuildManager] Leaving unapproved guild ${guild.name} (${guild.id})`)
                guild.leave();
            }
        });
    }

    handleError(err: Error) {
        try {
            logger.error(err);
        } catch (e: any) {
            console.error(e);
        }
    }
}