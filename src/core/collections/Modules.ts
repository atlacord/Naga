import Naga from '../Naga';
import { glob } from 'glob';
import { minimatch } from 'minimatch';
const each = require('async-each');
const jsonSchema = require('mongoose_schema-json');
import Collection from '../structures/Collection';

export default class ModuleCollection extends Collection {
    naga: Naga
    _client: any;
    _config: any;
    moduleList: string[];
    _listenerCount: number;

    constructor(config, naga) {
        super();

        this.naga = naga;
        this._client = naga.client;
        this._config = config;
        this._listenerCount = 0;

        this.moduleList = this._config.moduleList || [];

        this.loadModules();
    }

    unload() {
        for (let module of this.values()) {
            module._unload();
            this.delete(module.name);
        }
    };

    /**
     * Load commands
     */
    async loadModules() {
        try {
            var files: any = await glob('**/*.js', {
                cwd: this._config.paths.modules,
                root: this._config.paths.modules,
                absolute: true,
            });
            files = files.filter(f => !minimatch(f, '**/commmands/*'));
        } catch (err) {
            this.naga.logger.error(err);
        }

        let modules: string[] = [];

        each(files, (file, next) => {
            if (file.endsWith('.map')) return next();

            const module = require(file);

            if (module.hasModules) {
                modules = modules.concat(Object.values(module.modules));
                return next();
            }

          modules.push(require(file));
            return next();
        }, err => {
            if (err) {
                this.naga.logger.error(err);
            };

            this.naga.utils.asyncForEach(modules, (module, next) => {
                this.register(module);
                return;
            });
            this.naga.logger.info(`[ModuleManager] Registered ${this.size} modules.`);
        });
    };


    /**
     * Register module
     */
    public register(Module) {
        if (Object.getPrototypeOf(Module).name !== 'Module') {
            return this.naga.logger.debug(`[ModuleManager] Skipping unknown module.`);
        }

        let module = new Module(this.naga),
            activeModule = this.get(module.name),
            globalConfig = this.naga.globalConfig;

        if (activeModule) {
            this.naga.logger.debug(`[ModuleManager] Reloading module ${module.name}`);
            activeModule._unload();
            this.delete(module.name);
        }

        this.naga.logger.debug(`[ModuleManager] Registering module ${module.name}`);

        if (module.commands) {
			const commands = Array.isArray(module.commands) ? module.commands : Object.values(module.commands);
			each(commands, command => this.naga.commands.register(command));
		}

		if (module.moduleModels) {
			this.registerModels(module.moduleModels);
		}

		// ensure the module defines all required properties/methods
		module.ensureInterface();

		if (!activeModule) {
			const moduleCopy = module.toJSON();

			if (module.settings) {
				moduleCopy.settings = jsonSchema.schema2json(module.settings);

				this.naga.db.models.Server.schema.add({
				[module.name.toLowerCase()]: module.settings,
				});
			}

			moduleCopy._state = this._config.state;

			this.naga.db.models.Module.findOneAndUpdate({ name: module.name, _state: this._config.state }, moduleCopy, { upsert: true, overwrite: true })
			.catch(err => this.naga.logger.error(err));
		}

		this.set(module.name, module);

		if (this.moduleList.length && !this.moduleList.includes(Module.name)) {
			return;
		}

		if (globalConfig && globalConfig.modules.hasOwnProperty(module.name) &&
			globalConfig.modules[module.name] === false) return;

		each(this.naga.dispatcher.events, (event, next) => {
			if (!module[event]) return next();
			module.registerListener(event, module[event]);
			this._listenerCount++;
			next();
		}, err => {
			if (err) this.naga.logger.error(err);
			this.get(module.name)._start(this._client);
		});
	}

	registerModels(moduleModels) {
		if(!moduleModels || !moduleModels.length || moduleModels.length === 0) {
			return;
		}

		each(moduleModels, (model, next) => {
			if(typeof model !== 'object' || !model.name || (!model.skeleton && !model.schema)) {
				next();
				return;
			}

			this.naga.logger.debug(`[ModuleCollection] Registering model: ${model.name}`);

			const schema = new this.naga.db.Schema(model.skeleton || model.schema, model.options);

			this.naga.db.registerModel({ name: model.name, schema });
		});
	}

	/**
	 * Enable or disable a module
	 */
	async toggle(id: string, name: string, enabled: string|boolean): Promise<any> {
		let guildConfig = await this.naga.guilds.getOrFetch(id),
			guild       = this._client.guilds.get(id),
			module      = this.get(name),
			key         = `modules.${name}`;

		enabled = enabled === 'true';

		if (!guild || !guildConfig)
			return Promise.reject(`Couldn't get guild or config for module ${name}.`);

		guildConfig.modules[name] = enabled;

		if (enabled && module && module.enable) module.enable(guild);
		if (!enabled && module && module.disable) module.disable(guild);

		// return this.naga.guilds.update(guildConfig._id, { $set: { [key]: enabled } });
	}
}

module.exports = ModuleCollection;
