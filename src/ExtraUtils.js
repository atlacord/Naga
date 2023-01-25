const { Utils } = require('axoncore');
const { Message } = require('eris');
const secret = require('../configs/secret.json');
const fetch = require('node-fetch')


const DISCORD_EPOCH = 1420070400000;

class ExtraUtils extends Utils {

    cleanRegex = new RegExp('([_\*`])', 'g');

    /**
     * @param {import('axoncore').AxonClient} client
     */
    constructor(client) {
        super(client);
        this.invite = /^(discord.gg\/|discordapp.com\/invite\/)([a-z0-9]+)$/gi;
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
        spotify: 1947988
        }

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

        if ((user.roles.includes('456925799786872868')) && (!user.roles.includes('372084219423490049'))) {
            staff.push('Sentry');
        }

        if (user.roles.includes('762573162424565780')) {
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
        await this.bot.getChannel(secret.bot.logChannel).createMessage({
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
/**
 * Fetch data from Anilist
 * @param {String} query graphql query to search with
 * @param {Object} variables variables to include in the search
 * @returns {Promise<data>} fetch result
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
      let toAdd = ` • [${arr[i].name}](${arr[i].url})`
  
      if (toAdd.length + res.length > 950) {
        lastindex = i
        return
      }
  
      return res += toAdd
    }
  
    return `${res}${lastindex && lastindex < arr.length - 1 ? ` and ${arr.length - lastindex - 1} more!`:`.`}`
  }

}
module.exports = ExtraUtils;
