import * as djs from 'discord.js';

import config from './Config';
import Logger from './Logger';
import { Utils } from '../Structures';

import PermissionsManager from '../Managers/PermissionsManager';
import CommandManager from '../Managers/CommandManager';
import ModuleManager from '../Managers/ModuleManager';

import SpiritLibrary from './Database/Database';

export default class Naga {
    private _client: djs.Client;
    public isReady: boolean;

    public _utils: Utils;
    public _logger: Logger;
    public permissions: PermissionsManager;
    public commands: CommandManager;
    public modules: ModuleManager;
    public _db: SpiritLibrary;

    constructor() {
        this.isReady = false;
    }

    public get client() {
        return this._client;
    }

    public get config() {
        return config;
    }

    public get utils() {
        return this._utils;
    }

    public get logger() {
        return this._logger;
    }

    public get db() {
        return this._db;
    }

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
        this._client = new djs.Client(options);

        // Initialize manager classes
        this.permissions = new PermissionsManager(this);
        this.commands = new CommandManager(this);
        this.modules = new ModuleManager(this);

        // Event functions
        this.client.once('ready', this.ready.bind(this));
        this.client.on('error', err => this.logger.error(err))

        // Connect to Discord
        const token = process.env.TOKEN as string;
        await this.login(token);
    }

    /**
     * Connects to the Discord gateway
     * @param t Bot token
     */
    public async login(t: string): Promise<void> {
        const token = 'Bot ' + t;
        this.logger.info('Connecting to Discord...', 'BotClient');
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
        this.logger.info(`Successfully connected to Discord as ${this.utils.fullName(this.client.user)}`, 'BotClient');
        this.isReady = true;

        await this.editStatus({name: 'Testing', type: 0})
    }
}