import * as djs from 'discord.js';
import Naga from '../Core/Naga';
import Utils from './Utils';

export default class Base {
    public guild!: djs.Guild;
    private _naga: Naga;

    constructor(naga: Naga, guild: djs.Guild) {
        this._naga = naga;

        if (guild) {
            this.guild = guild;
        }
    }


    /**
     * The Naga instance
     */
    public get naga(): Naga {
        return this._naga;
    }

    /**
     * The djs client instance 
     */
    public get client(): djs.Client {
        return this.naga.client;
    }

    public get utils(): Utils {
        return this.naga.utils;
    }

    /**
     * Checks if user is a developer
     * @param user A User object
     * @returns {boolean}
     */
    public isDeveloper(user: djs.User): boolean {
        return this.naga.permissions.isDeveloper(user);
    }

    /**
     * Checks if user is a server admin
     * @param member A GuildMember object
     * @returns {boolean}
     */
    public isServerAdmin(member: djs.GuildMember, channel: djs.GuildChannel): boolean {
        return this.naga.permissions.isServerAdmin(member, channel);
    }

    /**
     * Checks if user is a server mod
     * @param member A GuildMember object
     * @returns {boolean}
     */
    public isServerMod(member: djs.GuildMember): boolean {
		return this.naga.permissions.isServerMod(member);
	}

    /**
     * A wrapper to send messages
     * @param channel A TextableChannel snowflake (TextChannel, DMChannel, etc.)
     * @param content Message content
     * @param options Message options
     * @returns {Promise<djs.Message>}
     */
    public sendMessage(channel: djs.TextBasedChannel, content: any, options?: any): Promise<any> {
        return this.utils.sendMessage(channel, content, options);
    }

}