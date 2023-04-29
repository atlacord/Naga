import * as eris from 'eris';
import axios from 'axios';
import Module from './Module';
import Naga from '../Naga';

interface Base {
    suppressOutput?: boolean;
    responseChannel?: eris.TextChannel;
}

class Base {
    public _naga: Naga
    public guild: eris.Guild;
    public module: string|Module

    constructor(naga: Naga, guild?: eris.Guild) {
        this._naga = naga;

        if (guild) {
            this.guild = guild;
        }
    }

	public toJSON(): object {
		const copy: {[key: string]: any} = {};

		for (const key in this) {
			if (!this.hasOwnProperty(key) || key.startsWith('_')) {
				continue;
			}

			if (!this[key]) {
				copy[key] = this[key];
			} else if (<any>this[key] instanceof Set) {
				copy[key] = Array.from(<any>this[key]);
			} else if (<any>this[key] instanceof Map) {
				copy[key] = Array.from((<any>this[key]).values());
			} else if ((<any>this[key]).toJSON != undefined) {
				copy[key] = (<any>this[key]).toJSON();
			} else {
				copy[key] = this[key];
			}
		}

		return copy;
	}


    public get naga() {
        return this._naga;
    }

    public get client() {
        return this.naga.client;
    }

    public get db() {
        return this.naga.db;
    }

    public get utils() {
        return this.naga.utils;
    }

    public get permissionsManager() {
		return this.naga.permissions;
	};

    public isDev(user: eris.User): boolean {
		return this.naga.permissions.isDev(user);
	};

    public isServerOwner(member: eris.Member, guild: eris.Guild) {
        return this.naga.permissions.isServerOwner(member, guild);
    }

    public isStaff(member: eris.Member, channel: eris.GuildChannel): boolean {
        return this.naga.permissions.isStaff(member, channel);
    };

    public sendDM(userId: string, content: eris.MessageContent): Promise<eris.Message> {
		return new Promise((resolve: Function, reject: Function) =>
			this.client.getDMChannel(userId)
				.catch(reject())
				.then((channel: eris.PrivateChannel) => {
					if (!channel) {
						return reject('Channel is undefined or null.');
					}
					return this.sendMessage(channel, content).catch(() => false);
				}));
	};

    public sendMessage(channel: eris.TextableChannel, content: eris.MessageContent, options?: any): Promise<eris.Message> {
		if (this.suppressOutput) {
			return Promise.resolve(null);
		}
		if (this.responseChannel) {
			return this.utils.sendMessage(this.responseChannel, content, options);
		}
		return this.utils.sendMessage(channel, content, options);
	};

    public sendCode(channel: eris.TextableChannel, content: string, ...args: any[]): Promise<{}> {
		return this.utils.sendCode(channel, content, ...args);
	};

    public success(channel: eris.TextableChannel, content: string, ...args: any[]): Promise<{}> {
		const embed = {
			color: this.utils.getColor('green'),
			description: `${this.naga.config.emojis.success} ${content}`,
		};

		return this.sendMessage(channel, { embed }, ...args);
	};

    public info(channel: eris.TextableChannel, content: string, ...args: any[]): Promise<{}> {
		const embed = {
			color: this.utils.getColor('blue'),
			description: `${this.naga.config.emojis.info} ${content}`,
		};

		return this.sendMessage(channel, { embed }, ...args);
	};

    public error(channel: eris.TextableChannel, content: string, err?: Error) {
		const embed = {
			color: this.utils.getColor('red'),
			description: `${this.naga.config.emojis.error} ${content}`,
		};

		return new Promise((resolve: Function, reject: Function) =>
			this.sendMessage(channel, { embed })
				.catch((e: Error) => e)
				.then(() => reject(err || content)));
	};

    public logError(err: string, type: string = 'module.error') {
		const meta = {
			type: type,
			guild: null,
		};

		if (this.guild != undefined) {
			meta.guild = this.guild.id;
		}

		this.naga.logger.error(err, meta);
	};
};

export default Base;