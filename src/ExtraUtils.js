const { Utils } = require('axoncore');
const { Message } = require('eris');
const { Tatsu } = require('tatsu');
const fetch = require('node-fetch');
require('dotenv').config();

const profile = require('./Models/Profile');
const tatsu = new Tatsu('jjyo4ESeJ0-sxQ9dSRB8zmsB8edoxVuE7');

const DISCORD_EPOCH = 1420070400000;

let flags = {
    "STAFF": {
        "friendly": "<:DiscordStaff:1102389679380246538> Discord Employee",
        "description": "User is a Discord employee.",
        "shift": 0,
    },
    "PARTNER": {
        "friendly": "<a:discordPartner:1006803535238811658> Discord Partner",
        "description": "User is a Discord partner.",
        "shift": 1,
    },
    "HYPESQUAD": {
        "friendly": "<:HypeSquadEvents:1102390600675901530> HypeSquad Events",
        "description": "User is a HypeSquad Events member.",
        "shift": 2,
    },
    "BUG_HUNTER_LEVEL_1": {
        "friendly": "<:BugHunterLvl1:1102390616849141762> Bug Hunter Level 1",
        "description": "User is a Bug Hunter.",
        "shift": 3,
    },
    "HYPESQUAD_ONLINE_HOUSE_1": {
        "friendly": "<:Bravery:1102389675550838824> HypeSquad Bravery",
        "description": "User is part of HypeSquad Bravery.",
        "shift": 6,
    },
    "HYPESQUAD_ONLINE_HOUSE_2": {
        "friendly": "<:Brilliance:1102389676498767894> HypeSquad Brilliance",
        "description": "User is part of HypeSquad Brilliance.",
        "shift": 7,
    },
    "HYPESQUAD_ONLINE_HOUSE_3": {
        "friendly": "<:Balance:1102389669943062611> HypeSquad Balance",
        "description": "User is a part of HypeSquad Balance.",
        "shift": 8,
    },
    "PREMIUM_EARLY_SUPPORTER": {
        "friendly": "<:EarlySupporter:1102389681024401478> Legacy Nitro Subscriber",
        "description": "User is an Early Supporter.",
        "shift": 9,
    },
    "BUG_HUNTER_LEVEL_2": {
        "friendly": "<:BugHunterLvl2:1102390618673647716> Bug Hunter Level 2",
        "description": "User has the gold Bug Hunter badge.",
        "shift": 14,
    },
    "VERIFIED_DEVELOPER": {
        "friendly": "<:VerifiedDev:1102389683520016484> Verified Bot Developer",
        "description": "User is a verified bot developer.",
        "shift": 17,
    },
    "CERTIFIED_MODERATOR": {
        "friendly": "<:DiscordModProgram:1102389678340067399> Discord Moderator Program Member",
        "description": "User is a Discord certified moderator alum.",
        "shift": 18,
    },
    "ACTIVE_DEVELOPER": {
        "friendly": "<:ActiveDev:1102389668848349264> Active Developer",
        "description": "User is an active developer. https://discord.com/developers/active-developer",
        "shift": 22,
    },
};

class ExtraUtils extends Utils {

    cleanRegex = new RegExp('([_\*`])', 'g');

    /**
     * @param {import('axoncore').AxonClient} client
     */
    constructor(client) {
        super(client);
        this.invite = /^(discord.gg\/|discordapp.com\/invite\/)([a-z0-9]+)$/gi;
        this.levels = require('./assets/levels');
    }

    /**
     * Convert a hex code into a rgb code
     *
     * @param {String} hex -  The base10 number to convert OR the base10 number as a String
     * @returns {[Number, Number, Number]} rgb color code `[xxx, xxx, xxx]`
     */
    hexToRgb(hex) {
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
            pink: 16736378,
            spotify: 1947988,
            discordgrey: 2632496,
            lotus: 15913095,
            whitelotus: 16777215,
            sentry: 9725695,
            daili: 5628531,
            moverstars: 54998
        };

        return colors[color];
    }
    
    emote = {
        "error": "<:no:917982868922335272>",
        "success": "<:yes:917982955362734100>"
    };

    getStaff() {
        return this.axon.staff
    }

    /**
    * Convert a rgb code into a hex code
    *
    * @param {Number} red - RGB value for Red
    * @param {Number} green - RGB value for Green
    * @param {Number} blue - RGB value for Blue
    * @returns {String} Hex color code (6 char) (without #)
    */
    rgbTOhex(red, green, blue) {
        return ( (blue | (green << 8) | (red << 16) ) | (1 << 24) ).toString(16).slice(1);
    }

    /**
	 * Escape special characters in regex
	 */
	regEscape(str) {
		return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
	}

    clean(str) {
		return str.replace(this.cleanRegex, '\\$&');
	}


    /**
    * Joins array via oxford comma and append 'and' on last 2 items
    * @param {array} array the array to join
    * @returns {string} the joined array
    */
    joinArray(array = []){
        return list.format(array.map(x => String(x)));
    }

    /**
     * Returns a list of Discord user flags in a human readable format
     * @param {Number} flagNumber 
     * @returns {Array} An array of flag strings
     */
    getFlags(flagNumber) {
        let results = [];

        for (let i = 0; i <= 64; i++) {
            const bitwise = 1n << BigInt(i);
    
            if (flagNumber & parseInt(bitwise)) {
                const flag = Object.entries(flags).find((f) => f[1].shift === i)?.[0] || `UNKNOWN_FLAG_${i}`;
                if (flag !== `UNKNOWN_FLAG_${i}`) results.push(flags[flag].friendly);
            }
        }
    
        return results || "None";
    }

        /**
     * TextTruncate -> Shortens the string to desired length
     * @param {string} str the string to test with
     * @param {number} length the length the string should have
     * @param {string} end the end of the string indicating it's truncated
     * @returns {string} Truncated string
     */
    textTruncate(str = '', length = 100, end = '...') {
        return String(str).substring(0, length - end.length) + (str.length > length ? end : '');
    }

    truncate(...options) {
        return this.textTruncate(...options);
    }

    /**
     * Converts number to string and adds a comma separator
     * @param {number|string} number the Number to convert
     * @param {number} maximumFractionDigits the number of decimal places to include in result
     * @example commatize(11235) will return `11,235`; commatize(1234.567, 2) will return `1,234.57`
     * @returns {string} number with commas
     * @note Numbers greater than 10e307 will return '∞'
     */
    commatize(number, maximumFractionDigits = 2) {
        return Number(number || '')
        .toLocaleString('en-US', { maximumFractionDigits });
    }

        /**
     * Appends ordinal suffixes to input numbers. Max input before failing is 10e307
     * @param {number|string} n the Number to append ordinal suffix to
     * @example ordinalize(10) -> returns `10th`; ordinalize(22) -> returns `22nd`
     * @returns {string} Ordinalized number
     * @note Does not support negative numbers!
     */
    ordinalize(n = 0) {
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
    displayName(guildID, userID) {
        return this.bot.getRESTGuildMember(guildID, userID).nick ?? this.bot.getRESTUser(userID).username;
    }

     /**
     * 
     * @param {string} user User ID
     * @returns {string} Whether the provided user is the server owner or not.
     */
    isServerOwner(member) {
        return member === this.bot.guilds.get('370708369951948800').ownerID;
    }

    checkStaff(user) {
        let staff = []

        if (this.isServerOwner(user.id) === true) {
            staff.push('Server Owner');
        }

        if (this.axon.staff.owners.includes(user.id)) {
            staff.push('Naga Developer');
        }

        if (user.roles.includes('372084219423490049')) {
            staff.push('White Lotus');
        };

        if ((user.roles.includes('1182448979288527029')) && (!user.roles.includes('372084219423490049'))) {
            staff.push('Sentry');
        }

        if (user.roles.includes('1182449762583191592')) {
            staff.push('Dai Li');
        }
    
        if (user.roles.includes('871891314982133791')) {
            staff.push('Lotus Emeritus');
        }

        if (user.roles.includes('871374813288083516')) {
            staff.push('Wiki Writer');
        }

        if (user.roles.includes('830138455337730049')) {
            staff.push('Event Master');
        }

        if (user.roles.includes('721140469576237076')) {
            staff.push('Stream Master')
        }
        return staff;
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

    /**
   * Creates a Promise that resolves after a specified duration.
   * @param {Message} msg Message object
   * @param {Error} err Error object
   * @param {string} type Type of error
   * @param {string} message Message to send to the command channel
   * @returns {Promise<void>}
   */
    async logError(msg, err, type, message) {
        await this.bot.getChannel(process.env.LOG_CHANNEL).createMessage({
            embed: {
                author: { name: msg.channel.guild.name, icon_url: msg.channel.guild.iconURL },
                title: 'Error',
                color: this.getColor('red'),
                description: `\`\`\`${err.stack}\`\`\``,
                timestamp: new Date()
            }
        })
        return this.axon.log('FATAL', `Unexpected error [${msg.channel.guild.name} - ${msg.channel.guild.id}]!\n${err.stack}`), 
        this.axonUtils.sendError(msg.channel, message)
    }

    convertSnowflakeToDate(snowflake, epoch = DISCORD_EPOCH) {
        const milliseconds = BigInt(snowflake) >> 22n
        return new Date(Number(milliseconds) + epoch)
    }

    validateSnowflake(snowflake, epoch) {
        if (!Number.isInteger(+snowflake)) {
            this.sendError(msg.channel, 'That doesn\'t look like a snowflake. Snowflakes contain only numbers.')
        }
    
        if (snowflake < 4194304) {
            this.sendError(msg.channel, 'That doesn\'t look like a snowflake. Snowflakes are much larger numbers.')
        }
    
        const timestamp = this.convertSnowflakeToDate(snowflake, epoch)
    
        if (Number.isNaN(timestamp.getTime())) {
            this.sendError(msg.channel, 'That doesn\'t look like a snowflake. Snowflakes have fewer digits.')
        }
    
        return timestamp;
    }

    /**
	 * Resolve username/id/mention
	 */
    resolveUser(guild, user, context, exact) {
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

        	if (discrim === '0') return username;
		else return `${username}#${discrim}`;
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
			const webhooks = await this.bot.getChannelWebhooks(channel.id);

			if (!webhooks || !webhooks.length) {

				const wh = await this.bot.createChannelWebhook(channel.id, {
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
/*
    Query from anilist's graphql 
*/ 
    AniListQuery(query, variables) {

        return fetch('https://graphql.anilist.co', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            query,
            variables
          })
        }).then(res => res.json())
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

    async updateMemberLevel(m) {
        let guild = this.bot.guilds.get('370708369951948800')
        let member = this.resolveUser(guild, m);
        if (!member.bot) {
            let tatsuProfile = await tatsu.getMemberRanking('370708369951948800', member.id);
                profile.findById(member.id, async (err, doc) => {

                if (!doc) return;

                let score = tatsuProfile.score;
                let level;
                switch (true) {
                    case (score < this.levels[1]):
                        level = 0;
                        break;
                    case (score < this.levels[2]):
                        level = 1;
                        break;
                    case (score < this.levels[3]):
                        level = 2;
                        break;
                    case (score < this.levels[4]):
                        level = 3;
                        break;
                    case (score < this.levels[5]):
                        level = 4;
                        break;
                    case (score < this.levels[6]):
                        level = 5;
                        break;
                    case (score < this.levels[7]):
                        level = 6;
                        break;
                    case (score < this.levels[8]):
                        level = 7;
                        break;
                    case (score < this.levels[9]):
                        level = 8;
                        break;
                    case (score < this.levels[10]):
                        level = 9;
                        break;
                    case (score < this.levels[11]):
                        level = 10;
                        break;
                    case (score < this.levels[12]):
                        level = 11;
                        break;
                    case (score < this.levels[13]):
                        level = 12;
                        break;
                    case (score < this.levels[14]):
                        level = 13;
                        break;
                    case (score < this.levels[15]):
                        level = 14;
                        break;
                    case (score < this.levels[16]):
                        level = 15;
                        break;
                    case (score < this.levels[17]):
                        level = 16;
                        break;
                    case (score < this.levels[18]):
                        level = 17;
                        break;
                    case (score < this.levels[19]):
                        level = 18;
                        break;
                    case (score < this.levels[20]):
                        level = 19;
                        break;
                    case (score < this.levels[21]):
                        level = 20;
                        break;
                    case (score < this.levels[22]):
                        level = 21;
                        break;
                    case (score < this.levels[23]):
                        level = 22;
                        break;
                    case (score < this.levels[24]):
                        level = 23;
                        break;
                    case (score < this.levels[25]):
                        level = 24;
                        break;
                    case (score < this.levels[26]):
                        level = 25;
                        break;
                    case (score < this.levels[27]):
                        level = 26;
                        break;
                    case (score < this.levels[28]):
                        level = 27;
                        break;
                    case (score < this.levels[29]):
                        level = 28;
                        break;
                    case (score < this.levels[30]):
                        level = 29;
                        break;
                    case (score < this.levels[31]):
                        level = 30;
                        break;
                    case (score < this.levels[32]):
                        level = 31;
                        break;
                    case (score < this.levels[33]):
                        level = 32;
                        break;
                    case (score < this.levels[34]):
                        level = 33;
                        break;
                    case (score < this.levels[35]):
                        level = 34;
                        break;
                    case (score < this.levels[36]):
                        level = 35;
                        break;
                    case (score < this.levels[37]):
                        level = 36;
                        break;
                    case (score < this.levels[38]):
                        level = 37;
                        break;
                    case (score < this.levels[39]):
                        level = 38;
                        break;
                    case (score < this.levels[40]):
                        level = 39;
                        break;
                    case (score < this.levels[41]):
                        level = 40;
                        break;
                    case (score < this.levels[42]):
                        level = 41;
                        break;
                    case (score < this.levels[43]):
                        level = 42;
                        break;
                    case (score < this.levels[44]):
                        level = 43;
                        break;
                    case (score < this.levels[45]):
                        level = 44;
                        break;
                    case (score < this.levels[46]):
                        level = 45;
                        break;
                    case (score < this.levels[47]):
                        level = 46;
                        break;
                    case (score < this.levels[48]):
                        level = 47;
                        break;
                    case (score < this.levels[49]):
                        level = 48;
                        break;
                    case (score < this.levels[50]):
                        level = 49;
                        break;
                    case (score < this.levels[51]):
                        level = 50;
                        break;
                    case (score < this.levels[52]):
                        level = 51;
                        break;
                    case (score < this.levels[53]):
                        level = 52;
                        break;
                    case (score < this.levels[54]):
                        level = 53;
                        break;
                    case (score < this.levels[55]):
                        level = 54;
                        break;
                    case (score < this.levels[56]):
                        level = 55;
                        break;
                    case (score < this.levels[57]):
                        level = 56;
                        break;
                    case (score < this.levels[58]):
                        level = 57;
                        break;
                    case (score < this.levels[59]):
                        level = 58;
                        break;
                    case (score < this.levels[60]):
                        level = 59;
                        break;
                    case (score < this.levels[61]):
                        level = 60;
                        break;
                    case (score < this.levels[62]):
                        level = 61;
                        break;
                    case (score < this.levels[63]):
                        level = 62;
                        break;
                    case (score < this.levels[64]):
                        level = 63;
                        break;
                    case (score < this.levels[65]):
                        level = 64;
                        break;
                    case (score < this.levels[66]):
                        level = 65;
                        break;
                    case (score < this.levels[67]):
                        level = 66;
                        break;
                    case (score < this.levels[68]):
                        level = 67;
                        break;
                    case (score < this.levels[69]):
                        level = 68;
                        break;
                    case (score < this.levels[70]):
                        level = 69;
                        break;
                    case (score < this.levels[71]):
                        level = 70;
                        break;
                    case (score < this.levels[72]):
                        level = 71;
                        break;
                    case (score < this.levels[73]):
                        level = 72;
                        break;
                    case (score < this.levels[74]):
                        level = 73;
                        break;
                    case (score < this.levels[75]):
                        level = 74;
                        break;
                    case (score < this.levels[76]):
                        level = 75;
                        break;
                    case (score < this.levels[77]):
                        level = 76;
                        break;
                    case (score < this.levels[78]):
                        level = 77;
                        break;
                    case (score < this.levels[79]):
                        level = 78;
                        break;
                    case (score < this.levels[80]):
                        level = 79;
                        break;
                    case (score < this.levels[81]):
                        level = 80;
                        break;
                    case (score < this.levels[82]):
                        level = 81;
                        break;
                    case (score < this.levels[83]):
                        level = 82;
                        break;
                    case (score < this.levels[84]):
                        level = 83;
                        break;
                    case (score < this.levels[85]):
                        level = 84;
                        break;
                    case (score < this.levels[86]):
                        level = 85;
                        break;
                    case (score < this.levels[87]):
                        level = 86;
                        break;
                    case (score < this.levels[88]):
                        level = 87;
                        break;
                    case (score < this.levels[89]):
                        level = 88;
                        break;
                    case (score < this.levels[90]):
                        level = 89;
                        break;
                    case (score < this.levels[91]):
                        level = 90;
                        break;
                    case (score < this.levels[92]):
                        level = 91;
                        break;
                    case (score < this.levels[93]):
                        level = 92;
                        break;
                    case (score < this.levels[94]):
                        level = 93;
                        break;
                    case (score < this.levels[95]):
                        level = 94;
                        break;
                    case (score < this.levels[96]):
                        level = 95;
                        break;
                    case (score < this.levels[97]):
                        level = 96;
                        break;
                    case (score < this.levels[98]):
                        level = 97;
                        break;
                    case (score < this.levels[99]):
                        level = 98;
                        break;
                    case (score < this.levels[100]):
                        level = 99;
                        break;
                    case (score < this.levels[101]):
                        level = 100;
                        break;
                }

                doc.data.global_xp = score;
                doc.data.global_level = level;
                doc.save();
                return level;
            })
        }
    }

}

module.exports = ExtraUtils;
