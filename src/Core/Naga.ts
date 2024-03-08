import * as djs from 'discord.js';

import Utils from '../Structures/Utils';

import PermissionsManager from '../Managers/PermissionsManager';

export default class Naga {
    private _client!: djs.Client;
    public isReady: boolean;

    public _utils: Utils;
    public permissions: PermissionsManager;

    constructor() {
        this.isReady = false;
    }

    public get client() {
        return this._client;
    }

    public get utils() {
        return this._utils;
    }

    /**
     * Initializes the bot client
     * @param opts Client options
     */
    public async setup(opts: djs.ClientOptions) {
        let options: djs.ClientOptions = opts;

        options.allowedMentions = opts.allowedMentions || { parse: [ 'roles'] };
        options.intents = opts.intents || [djs.GatewayIntentBits.Guilds];

        // Initialize the discord.js client
        this._client = new djs.Client(options);

        // Initialize manager classes
        this.permissions = new PermissionsManager(this);

        // Event functions
        this.client.once('ready', this.ready.bind(this));
        this.client.on('error', err => console.error(err))

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
        console.info('Connecting to Discord...');
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
        console.log(`Successfully connected to Discord as ${this.client.user!.username}`)
        this.isReady = true;

        await this.editStatus({name: 'Testing', type: 0})
    }
}