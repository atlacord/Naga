import { Client } from 'discord.js';
import Naga from '../Core/Naga';
import { EventCollection } from '../Structures';

export default class CommandManager extends EventCollection {
    public naga: Naga;
    public _client: Client;

    constructor(naga: Naga) {
        super();
        this.naga = naga;
        this._client = naga.client;
    }

    public get logger() {
        return this.naga.logger;
    }

    /**
     * Loads commands into the database
     * @param Command Command class instance
     * @returns 
     */
    public register(Command: any): void {
        if (Object.getPrototypeOf(Command).name !== 'Command') {
		    return this.logger.debug('Skipping unknown command');
		}

        let command = new Command(this.naga);

        command.name = command.aliases[0];

        this.logger.info(`Registering command ${command.name}`);

        this.naga.models.Command.update({ name: command.name, _state: this.naga.config.state }, command.toJSON(), { upsert: true })
    }
}