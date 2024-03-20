import * as djs from 'discord.js';
import path from 'path';

const MAX_ITERATIONS_PER_TICK = 500;

/**
 * Utility functions, from the Utils class of @dyno.gg/dyno-core.
 * @license Creative-Commons-Attribution-NonCommercial-NoDerivs-4.0
 * @author Dyno Developers <https://dyno.gg>
 */
export default class Utils {

    private channelRegex: RegExp = new RegExp('{#([a-zA-Z0-9-_]+)}', 'g');
	private roleRegex: RegExp = new RegExp('{&([^}]+)}', 'g');
	private userRegex: RegExp = new RegExp('{@([^}]+)}', 'g');
	private emojiRegex: RegExp = new RegExp(/<(a)?:(\w+):(\d+)>/, 'g');
	private cleanRegex: RegExp = new RegExp('([_\*`])', 'g');
    private lastMessage: number;

    constructor() {}

    /**
     * Escapes special characters from regex
     * @param str A string to escape
     * @returns 
     */
    public regEscape(str: string): string {
        return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    public clean(str: string) {
		return str.replace(this.cleanRegex, '\\$&');
	}

    public fullName(user: djs.User|djs.ClientUser): string {
        user = user;

        let username = user.username;
        let discrim = user.discriminator;

        if (!username) return user.id;

        username = this.clean(username);

        if (discrim === '0') return username;

        return `${username}#${discrim}`;
    }

    /**
	 * Send a message to discord
	 */
	public async sendMessage(channel: djs.TextBasedChannel, message: any, options: any = {}): Promise<any> {
		if (!channel || !message) {
			return Promise.resolve();
		}

		if (Array.isArray(message)) {
			message = message.join('\n');
		}

		message = typeof message === 'string' ? { content: message, disableEveryone: true } : message;
		message.disableEveryone = options.disableEveryone != undefined ? options.disableEveryone : true;

		if (options.dm) {
			const user: djs.User = options.dm.user || options.dm;
			channel = user.dmChannel;
			if (!channel) {
				return Promise.reject('Unable to get or create a DM with this user.');
			}
		}

		return channel.send(message).then((msg: djs.Message) => {
			this.lastMessage = Date.now();

			if (options.pin) {
				msg.pin();
			}
			if (options.deleteAfter) {
				setTimeout(() => {
					msg.delete().catch(() => false);
				}, options.deleteAfter);
			}
			return msg;
		}).catch((err: any) => err);
	}

    public sendCode(channel: djs.TextBasedChannel, message: string = ' ', lang: string = '', options: any = {}): Promise<djs.Message> {
		let msg = `\`\`\`${lang}\n${message}\`\`\``;

		if (options.header) {
			msg = `${options.header}\n${msg}`;
		}

		if (options.footer) {
			msg = `${msg}\n${options.footer}`;
		}

		return this.sendMessage(channel, msg, options);
	}

    /**
	 * Sort roles by position or id
	 */
	public sortRoles(roles: any): djs.Role[] {
		return roles.size ?
			[...roles.values()].sort((r1: djs.Role, r2: djs.Role) =>
				(r1.position !== r2.position) ? r2.position - r1.position : <any>r1.id - <any>r2.id) :
				roles.sort((r1: djs.Role, r2: djs.Role) => (r1.position !== r2.position) ? r2.position - r1.position : <any>r1.id - <any>r2.id);
	}

    /**
	 * Convert hex color to integer
	 */
	public hexToInt(color: string): number {
		return color.startsWith('#') ? parseInt(color.replace('#', ''), 16) : parseInt(color, 16);
	}
};