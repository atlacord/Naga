import * as djs from 'discord.js';

declare module Naga {
    export interface NagaConfig {
        name: string;
        author: string;
        version: string|number;
        state: number;
        stateName: string;
        prefix: string;
        adminPrefix: string;
        developers: string[];
        contributors: string[];
        pkg: any;
        avatarGuild: string;
        testGuilds: string[];
        client: ClientConfig;
        database: {
            uri: string;
        };
        emojis: {
            success: string;
            error: string;
            info: string;
        };
        status: object;
    }

    export interface ClientConfig {
        id: string;
        token: string;
        options: {
            allowedMentions: djs.MessageMentionOptions;
            fetchAllUsers: boolean;
            intents: djs.IntentsBitField;
            messageCacheSize: number;
        }
    }

    export interface GlobalConfig {
        prefix: string;
        commands: {[key: string]: boolean};
        modules: {[key: string]: boolean};
        ignoredUsers: string[];
        [key: string]: any;
    }

    export interface GuildConfig {
        id: string;
        name: string;
        owner: string;
        prefix: string;
        modules: {[key: string]: boolean};
        commands: {[key: string]: boolean};
        adminRoles?: string[];
        modRoles?: string[];
        test?: boolean;
        ignoredUsers?: string[];
        ignoredRoles?: string[];
        [key: string]: any;
    }

    export class Naga {
        public isReady: boolean;
        public client: djs.Client;
        public readonly config: NagaConfig;
        public readonly globalconfig: GlobalConfig;
        public readonly utils: Utils;
        [key: string]: any;
    }

    export class Base {
        public readonly client: djs.Client;
        public readonly naga: Naga;
        public readonly config: NagaConfig;
        public readonly globalconfig: GlobalConfig;
        public readonly utils: Utils;
        constructor(naga: Naga, guild: djs.Guild);
        public isDeveloper(user: djs.User): boolean;
        public isServerAdmin(member: djs.GuildMember, channel: djs.GuildChannel): boolean;
        public isServerMod(member: djs.GuildMember): boolean;
        public sendMessage(channel: djs.TextBasedChannel, content: any, options?: any): Promise<any>;
    }

    export class Module extends Base {
        constructor(naga: Naga);
        [key: string]: any;
    }

    export interface ICommand {
        group         : string;
        module?       : string;
        aliases       : string[];
        description   : string;
        expectedArgs  : number;
        cooldown      : number;
        usage         : string|string[];
        defaultUsage? : string;
        disableDM?    : boolean;
        execute(data: CommandMetadata): Promise<{}>;
    }

    export interface CommandMetadata {
        message: djs.Message;
        args?: any[];
        t?: Function;
        command?: string;
        guildConfig?: GuildConfig;
        isDev?: boolean;
        isAdmin?: boolean;
    }

	export class Command extends Base {
		public name: string;
		public aliases: string[];
		constructor(naga: Naga);
		public help(message: djs.Message, guildConfig: GuildConfig): Promise<any>;
		[key: string]: any;
	}

    export class Utils {
        public regEscape(str: string): string;
        public clean(str: string);
        public fullName(user: djs.User): string;
        public async sendMessage(channel: djs.TextBasedChannel, message: any, options: any = {}): Promise<any>;
        public sendCode(channel: djs.TextBasedChannel, message: string = ' ', lang: string = '', options: any = {}): Promise<djs.Message>;
        public sortRoles(roles: any): djs.Role[];
        public hexToInt(color: string): number;
    }

    export class PermissionsManager {
        constructor(naga: Naga);
        public naga: Naga;
        public isDeveloper(user: djs.User): boolean;
        public isServerAdmin(member: djs.GuildMember, channel: djs.GuildChannel): boolean;
        public isServerMod(member: djs.GuildMember): boolean;
    }
}

export = Naga;