'use strict';
// @ts-nocheck

import Naga from '../Naga';
import { glob } from 'glob';
import { minimatch } from 'minimatch';
import EventCollection from '../structures/EventCollection';

/**
 * @class CommandCollection
 * @extends EventCollection
 */
export default class CommandCollection extends EventCollection {
    naga: Naga
    _client: any;
    _config: any;
	
    /**
	 * A collection of commands
	 */
	constructor(config, naga) {
		super();

		this.naga = naga;
		this._client = naga.client;
		this._config = config;

		this.loadCommands();
	}

	/**
	 * Load commands
	 */
	async loadCommands() {
		try {
			var files: any = await Promise.all([
				// glob('**/*.js', {
				// 	cwd: this._config.paths.commands,
				// 	root: this._config.paths.commands,
				// 	absolute: true,
				// }),
				glob('**/*.js', {
					cwd: this._config.paths.modules,
					root: this._config.paths.modules,
					absolute: true,
				}),
			]);
		} catch (err) {
			this.naga.logger.error(err);
		}

		files.forEach(file => {
			for (let i in file) {
				if (!file[i].endsWith('.js')) return;
				let load = () => {
					var command = require(file[i]);
					this.register(command);
				};
				load();
			// utils.time(load, file);
				return;
			};
		});
	}

	/**
	 * Register command
	 * @param {Function} Command A Command class to register
	 */
	register(Command) {
		if (Object.getPrototypeOf(Command).name !== 'Command') {
			return this.naga.logger.debug('[CommandCollection] Skipping unknown command');
		}

		// create the command
		let command: any = new Command(this.naga);

		// ensure command defines all required properties/methods
		command.name = command.aliases[0];

		this.naga.logger.debug(`[CommandCollection] Registering command ${command.name}`);

		this.naga.db.models.Command.updateOne({ name: command.name, _state: this._config.state }, command.toJSON(), { upsert: true })
		.catch(err => this.naga.logger.error(err));

		if (command.aliases && command.aliases.length) {
			for (let alias of command.aliases) {
				this.set(alias, command);
			}
		}
	}

	/**
	 * Unregister command
	 * @param {String} name Name of the command to unregister
	 */
	unregister(name) {
		this.naga.logger.info(`Unregistering command: ${name}`);

		const command = this.get(name);
		if (!command) return;

		if (!command.aliases && !command.aliases.length) return;
		for (let alias of command.aliases) {
			this.naga.logger.info(`Removing alias ${alias}`);
			this.delete(alias);
		}
	}
};
