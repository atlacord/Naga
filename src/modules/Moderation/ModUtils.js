const { Message, Member, Role } = require('eris');
const server = require('../../Models/Server');
const moment = require('moment');

const helpText = 'Make sure the Dyno role has `Manage Roles` and `Manage Channels` permissions.';
const noMemberError = 'I couldn\'t find that member.';
const permError = `I don't have enough permissions. ${helpText}`;
const modError = `That user is a mod/admin, I can't do that.`;
const hierarchyError = `My role isn't high enough to moderate this user. Move the Dyno role up above other roles.`;
const createError = `I can't create the Muted role. ${helpText}`;
const protectedError = `That user is protected, I can't do that.`;
const dmError = `I wasn't able to warn that user, they may have DM's disabled.`;

class ModUtils {
    constructor() {
        this.config = server.findById('370708369951948800');
    }

    cleanRegex = new RegExp('([_\*`])', 'g');

    clean(str) {
		return str.replace(this.cleanRegex, '\\$&');
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
    /**
    * Adds a guild member to a specified role.
    * @param {Message} msg Message object
    * @param {Member} member Guild member object
    * @param {Role} role Role object
    * @returns {Promise<void>}
   */
    addRole(message, member, role) {
        if (!member) {
            return noMemberError;
        }
    }

    setTimeout(message, member, limit) {
        let removeTimeout = new Date(Date.now() + limit);

        member.edit({ 
            communicationDisabledUntil: removeTimeout,
            reason: `Moderator: ${this.fullName(message.author)}`
        });

        if (limit === null) {
            return `Removed timeout from ${this.fullName(member)}.`
        } else {
            return `Successfully timed out ${this.fullName(member)} until <t:${Math.floor(removeTimeout / 1000)}:f>`;
        }
    }

    async sendEmbed(data, fields) {
        let embed = {
            title: data.action,
            color: data.color,
            fields: [
                { name: 'Member', value: this.fullName(data.user), inline: true },
                { name: 'Moderator', value: this.fullName(data.moderator), inline: true }
            ]
        };
        if (fields) {
            for (let i in data.fields) {
                embed.fields.push(data.fields[i]);
            }
        };

        await this.bot.getChannel(this.config.logChannel).createMessage({embed});
    }
}

module.exports = ModUtils