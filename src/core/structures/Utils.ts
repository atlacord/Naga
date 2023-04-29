import * as eris from 'eris';
import fs from 'fs';
import path from 'path';
import Naga from '../Naga';
import { Tatsu } from 'tatsu';
import axios from 'axios';

const tatsu = new Tatsu('jjyo4ESeJ0-sxQ9dSRB8zmsB8edoxVuE7');

const DISCORD_EPOCH = 1420070400000;
const MAX_ITERATIONS_PER_TICK = 500;

export default class Utils {
    naga: Naga;
    private lastMessage: number;

    cleanRegex = new RegExp('([_\*`])', 'g');

    /*
     * Convert a hex code into a rgb code
     */
    hexToRgb(hex: string): [number, number, number] {
        const num = parseInt(hex.replace('#', ''), 16);
        return [
            num >> 16,
            (num >> 8) & 255,
            num & 255,
        ];
    }

    getColor(color) {
        let colors = {
            red: 15747399,
            yellow: 16439902,
            green: 4437377,
            blue: 9031664,
            darkblue: 26544,
            spotify: 1947988,
            discordgrey: 2632496,
            lotus: 15913095,
            whitelotus: 16777215,
            sentry: 9725695,
            daili: 5628531
        };

        return colors[color];
    }

    /*
    * Convert a rgb code into a hex code
    */
    rgbTOhex(red: number, green: number, blue: number): string {
        return ( (blue | (green << 8) | (red << 16) ) | (1 << 24) ).toString(16).slice(1);
    }

    /**
	 * Escape special characters in regex
	 */
	regEscape(str: string): string {
		return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
	}

    clean(str: string): string {
		return str.replace(this.cleanRegex, '\\$&');
	}

    /*
     * TextTruncate -> Shortens the string to desired length
     * @param {string} str the string to test with
    */
    textTruncate(str: string = '', length: number = 100, end: string = '...'): string {
        return String(str).substring(0, length - end.length) + (str.length > length ? end : '');
    }

    truncate(...options) {
        return this.textTruncate(...options);
    }

    /**
     * Converts number to string and adds a comma separator
     * @example commatize(11235) will return `11,235`; commatize(1234.567, 2) will return `1,234.57`
     * @note Numbers greater than 10e307 will return '∞'
     */
    commatize(number: number|string, maximumFractionDigits: number = 2): string {
        return Number(number || '')
        .toLocaleString('en-US', { maximumFractionDigits });
    }

    /**
     * Appends ordinal suffixes to input numbers. Max input before failing is 10e307
     * @example ordinalize(10) -> returns `10th`; ordinalize(22) -> returns `22nd`
     * @note Does not support negative numbers!
     */
    ordinalize(n: number = 0): string {
        return Number(n) + [,'st','nd','rd'][n/10%10^1&&n%10] || Number(n )+'th';
    }

    /**
     * Converts a number to a stringified compact version
     * @param {number|string} number the Number to convert
     * @param {number} maximumFractionDigits the number of decimal places to include in result
     * @example compactNum(11235) will return `11.24K`; commatize(1234.567, 0) will return `1K`
     * @returns {string} compact version of the number
     * @note Maximum number for optimal usage is 10e13
     */
    compactNum(number, maximumFractionDigits = 2) {
        return Number(number || '')
        .toLocaleString('en-US', {
          notation: 'compact', maximumFractionDigits
        });
    }

    /**
     * @param {string} guildID guild ID
     * @param {string} userID User ID
     * @returns {string} member's display name
     */
    async displayName(guildID, userID): Promise<string> {
        return (await this.naga.client.getRESTGuildMember(guildID, userID)).nick ?? (await this.naga.client.getRESTUser(userID)).username;
    }

     /**
     * 
     * @param {string} user User ID
     * @returns {string} Whether the provided user is the server owner or not.
     */
    isServerOwner(member) {
        return member === this.naga.client.guilds.get('370708369951948800').ownerID;
    }

      /**
   * Creates a Promise that resolves after a specified duration.
   * @param {number} ms How long to wait before resolving (in milliseconds)
   * @returns {Promise<void>}
   */
    delayFor(ms) {
        return new Promise(resolve => {
          setTimeout(resolve, ms);
        });
    }

    convertSnowflakeToDate(snowflake, epoch = DISCORD_EPOCH) {
        const milliseconds = BigInt(snowflake) >> 22n
        return new Date(Number(milliseconds) + epoch)
    }

    validateSnowflake(snowflake, epoch) {
        if (!Number.isInteger(+snowflake)) {
            return Error('That doesn\'t look like a snowflake. Snowflakes contain only numbers.');
        }
    
        if (snowflake < 4194304) {
            return Error('That doesn\'t look like a snowflake. Snowflakes are much larger numbers.')
        }
    
        const timestamp = this.convertSnowflakeToDate(snowflake, epoch)
    
        if (Number.isNaN(timestamp.getTime())) {
            return Error('That doesn\'t look like a snowflake. Snowflakes have fewer digits.')
        }
    
        return timestamp;
    }

    /**
	 * Returns files within a directory recursively
	 */
	public async readdirRecursive(dir: string): Promise<string[]> {
		let list: string[] = [];
        let files = fs.readdirSync(dir);
		let dirs;

		function isDir(fname: string) {
			return fs.statSync(path.join(dir, fname)).isDirectory();
		}

		dirs = files.filter(isDir);

		files = files.filter((file: string) => !isDir(file));
		files = files.map((file: string) => path.join(dir, file));

		list = list.concat(files);

		while (dirs.length) {
			const l = await this.readdirRecursive(path.join(dir, dirs.shift()));
			list = list.concat(l);
		}

		return Promise.resolve(list);
	};

    public asyncForEach<V>(o: V[] | { [k: string]: V }, fn: (v: V, k: string|number, o: V[] | { [k: string]: V }, offset: number) =>
		void, maxIterationsPerTick?: number): Promise<void> {
			if (maxIterationsPerTick == null) {
				maxIterationsPerTick = MAX_ITERATIONS_PER_TICK;
			}

			return new Promise((resolve: any, reject: any) => {
				const keys = Object.keys(o);
				let offset = 0;
				if (keys.length < 1) {
					return resolve();
				}

				(function next() {
					try {
						const left = keys.length - offset;
						const max = offset + (left > maxIterationsPerTick ? maxIterationsPerTick : left);
						for (offset; offset < max; offset++) {
							fn((<any>o)[keys[offset]], keys[offset], o, offset);
						}
						offset--;
					} catch (e) {
						if (e.message === 'resolve') {
							return resolve();
						}
						return reject(e);
					}

					if (++offset < keys.length) {
						global.setImmediate(next);
					} else {
						resolve();
					}
				}());
			});
	}


    /**
	 * Resolve username/id/mention
	 */
    resolveUser(guild: eris.Guild, user: string, context?, exact?: boolean) {
		if (!user) {
			return null;
		}

		let users = [];

		if (context) {
			users = context;
		} else {
			users = guild ? [...guild.members.values()] : [];
		}

		if (!users || !users.length) {
			return null;
		}

		// check if it's a mention
		const regex = exact ? '<@!?([0-9]+)>$' : '<@!?([0-9]+)>';
		const mentionId = new RegExp(regex, 'g').exec(user);
		if (mentionId && mentionId.length > 1) {
			return users.find(u => u.id === mentionId[1]);
		}

		// check if it's username#1337
		if (user.indexOf('#') > -1) {
			const [name, discrim] = user.split('#');
			const nameDiscrimSearch = users.find(u => u.username === name && u.discriminator === discrim);
			if (nameDiscrimSearch) {
				return nameDiscrimSearch;
			}
		}

		// check if it's an id
		if (user.match(/^([0-9]+)$/)) {
			const userIdSearch = users.find(u => u.id === user);
			if (userIdSearch) {
				return userIdSearch;
			}
		}

		const exactNameSearch = users.find(u => u.username === user);
		if (exactNameSearch) {
			return exactNameSearch;
		}

		if (!exact) {
			const escapedUser = this.regEscape(user);
			// username match
			const userNameSearch = users.find(u => u.username.match(new RegExp(`^${escapedUser}.*`, 'i')) != undefined);
			if (userNameSearch) {
				return userNameSearch;
			}
		}

		return null;
	}

    resolveRole(guild, role) {
		const mention = new RegExp('<@&([0-9]+)>', 'g').exec(role);
		if (mention && mention.length > 1) {
			return guild.roles.get(mention[1]);
		}

		if (role.match(/^([0-9]+)$/)) {
			const roleIdSearch = guild.roles.get(role);
			if (roleIdSearch) {
				return roleIdSearch;
			}
		}

		const exactNameSearch = guild.roles.find((r) => r.name.toLowerCase() === role.toLowerCase());
		if (exactNameSearch) {
			return exactNameSearch;
		}

		const escapedRole = this.regEscape(role);

		const roleNameSearch = guild.roles.find((r) => r.name.match(new RegExp(`^${escapedRole}.*`, 'i')) != undefined);
		if (roleNameSearch) {
			return roleNameSearch;
		}
		return null;
	}

	/**
	 * Get the full username and discriminator for a user or member
	 */
    fullName(user, escape = true) {
		user = user.user || user;

		const discrim = user.discriminator || user.discrim;
		let username = user.username || user.name;

		if (!username) {
			return user.id;
		}

		username = this.clean(username);

		if (escape) {
			username.replace(/\\/g, '\\\\').replace(/`/g, `\`${String.fromCharCode(8203)}`);
		}

		return `${username}#${discrim}`;
	}

    convertSnowflake(snowflake, epoch = DISCORD_EPOCH) {
        const milliseconds = BigInt(snowflake) >> 22n
        return new Date(Number(milliseconds) + epoch)
    }

    async getOrCreateWebhook(channel) {
		const id = (typeof channel === 'string') ? channel : channel.id || null;
		if (!id) {
			return Promise.reject(`Invalid channel or id.`);
		}

		try {
			const webhooks = await this.naga.client.getChannelWebhooks(channel.id);

			if (!webhooks || !webhooks.length) {

				const wh = await this.naga.client.createChannelWebhook(channel.id, {
					name: 'Naga Archive',
				});

				return Promise.resolve(wh);
			}

			const webhook = webhooks.find((hook) => hook.name === 'Naga Archive');
			if (webhook) {
				return Promise.resolve(webhook);
			}

			return Promise.resolve(webhooks[0]);
		} catch (err) {
			return Promise.reject(err);
		}
	}

    /**
	 * Send a message to discord
	 */
	public async sendMessage(channel: eris.TextableChannel, message: any, options: any = {}): Promise<any> {
		if (!channel || !message) {
			return Promise.resolve();
		}

		if (Array.isArray(message)) {
			message = message.join('\n');
		}

		message = typeof message === 'string' ? { content: message, disableEveryone: true } : message;
		message.disableEveryone = options.disableEveryone != undefined ? options.disableEveryone : true;

		if (options.dm) {
			const user = options.dm.user || options.dm;
			channel = await user.getDMChannel().catch(() => false);
			if (!channel) {
				return Promise.reject('Unable to get or create a DM with this user.');
			}
		}

		return channel.createMessage(message).then((msg: eris.Message) => {
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

    /**
     * Sends a message formatted in a codeblock
     */
    public sendCode(channel: eris.TextableChannel, message: string = ' ', lang: string = '', options: any = {}): Promise<eris.Message> {
		let msg = `\`\`\`${lang}\n${message}\`\`\``;

		if (options.header) {
			msg = `${options.header}\n${msg}`;
		}

		if (options.footer) {
			msg = `${msg}\n${options.footer}`;
		}

		return this.sendMessage(channel, msg, options);
	}

    /*
     * Query from anilist's graphql 
    */ 
    AniListQuery(query, variables) {

        return axios.get('https://graphql.anilist.co', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          params: JSON.stringify({
            query,
            variables
          })
        }).then(res => JSON.stringify(res))
            .catch(err => err);
      }

    hyperlinkify(arr) {
        if (!arr.length) return null
    
        let res = ''
        let lastindex = null
    
        for (let i = 0; res.length < 950 && lastindex === null; i++) {
            let toAdd;
            if (arr === ('Characters' || 'People')) {
                toAdd = ` • [${arr[i].name}](${arr[i].url})`
            } else {
                toAdd = ` • [${arr[i].title}](${arr[i].url})`
            }
    
        if (toAdd.length + res.length > 950) {
            lastindex = i
            return
        }
    
        return res += toAdd
        }
    
        return `${res}${lastindex && lastindex < arr.length - 1 ? ` and ${arr.length - lastindex - 1} more!`:`.`}`
    }

    getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
    }
}

export const utils = new Utils();
