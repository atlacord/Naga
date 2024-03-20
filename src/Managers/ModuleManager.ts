import { Client } from 'discord.js';
import Naga from '../Core/Naga';
import { Collection, Command, Module } from '../Structures';
const each = require('async-each');

import * as modules from '../Modules';

export default class ModuleManager extends Collection {
    public naga: Naga;
    public _client: Client;
    public moduleList: Module[];

    constructor(naga: Naga) {
        super();
        this.naga = naga;
        this._client = naga.client;
        this.loadModules();
    }

    public get logger() {
        return this.naga.logger;
    }

    /**
     * Loads all modules from the modules directory
     */
    public loadModules(): void {
        for (const Value of Object.values(modules)) {
            const module = new Value(this.naga);
            try {
                this.register(module);
            } catch (e) {
                this.logger.error(__filename, e);
            }
        }

        this.logger.info(`Registered ${Object.keys(modules).length} modules.`)
    }

    /**
     * Loads modules into the database.
     * @param module Module class instance
     * @returns 
     */
    public register(module: any): void {
        if (!(module instanceof Module)) {
            return this.logger.error(`${module} is an invalid module.`);
        }

        //@ts-ignore
        let activeModule = this.get(module.name);

        if (activeModule) {
            // to-do
        }

        this.logger.debug(`Registering module ${module.name}.`);

        if (module.commands) {
            const commands = Array.isArray(module.commands) ? module.commands : Object.values(module.commands);
            each(commands, (command: Command) => this.naga.commands.register(command));
        }

        module.ensureInterface();
    }
}