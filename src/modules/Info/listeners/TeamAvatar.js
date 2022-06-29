const { Listener, Guild, Message } = require('axoncore');

class TeamAvatar extends Listener {
    /**
     * @param {import('axoncore').Module} module
     * @param {import('axoncore').ListenerData} data
     */
    constructor(module, data = {} ) {
        super(module, data);

        /** Event Name (Discord name) */
        this.eventName = 'guildMemberUpdate';
        /** Event name (Function name) */
        this.label = 'TeamAvatar';

        this.enabled = true;

        this.info = {
            description: 'Tracks TA-related activity (boost messages, role updates, etc.)',
        };
    }

    /**
     * @param {import('eris').Guild} guild
     * @param {import('eris').Member} member
     * @param {Object} oldMember
     * @param {import('axoncore').GuildConfig} guildConfig
     */

     async execute(guild, member, oldMember, guildConfig) { // eslint-disable-line
        const TAChannel = await this.bot.getChannel('826851222459514923');

        if (!oldMember.premiumSince === null && member.premiumSince !== null) {
            this.sendMessage(TAChannel, `**A new member joins the fold! A big thanks to ${member.mention} for boosting the server! Please make sure you read the pins for info on how to get the TA colour role and more!**`)
        }
        if ((oldMember.premiumSince === Date.now() && oldMember.roles.find(r => r.id === '829542940707127346')) && !member.premiumSince === null) {
            const colourrole = guild.roles.find(r => r.name === 'TA Colour')
            guild.removeMemberRole(member.id, colourrole.id, "User no longer boosting")
            this.sendMessage(TAChannel, `**A member of TA has left us, thanks to ${oldMember.mention} for their contributions!`)
        }

        return Promise.resolve(); 
    } 
}

module.exports = TeamAvatar;
