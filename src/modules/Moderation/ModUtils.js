const { Message, Member, Role } = require('eris');

const helpText = 'Make sure the Dyno role has `Manage Roles` and `Manage Channels` permissions.';
const noMemberError = 'I couldn\'t find that member.';
const permError = `I don't have enough permissions. ${helpText}`;
const modError = `That user is a mod/admin, I can't do that.`;
const hierarchyError = `My role isn't high enough to moderate this user. Move the Dyno role up above other roles.`;
const createError = `I can't create the Muted role. ${helpText}`;
const protectedError = `That user is protected, I can't do that.`;
const dmError = `I wasn't able to warn that user, they may have DM's disabled.`;

class ModUtils {

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
}

module.exports = ModUtils