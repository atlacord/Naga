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
     * @param {import('eris').Member} member
     * @param {Object} oldMember
     * @param {import('axoncore').GuildConfig} guildConfig
     */
    execute(member, oldMember, guildConfig) { // eslint-disable-line
        const TAChannel = server.channels.find(c => c.id === '826851222459514923')
        const server = guildConfig.guildID

        if(!oldMember.roles.find(r => r.name === 'Team Avatar') && member.roles.find(r => r.name === 'Team Avatar')) {
        TAChannel.createMessage(`**A new member joins the fold! A big thanks to ${member.mention} for boosting the server! Please make sure you read the pins for info on how to get the TA colour role and more!`)
        }
        if(oldMember.roles.find(r => r.name === 'Team Avatar') && oldMember.roles.find(r => r.name === 'TA Colour') && !member.roles.find(r => r.name === 'Team Avatar')) {
            const colourrole = server.roles.find(r => r.name === 'TA Colour')
            server.guild.removeMemberRole(member.id, colourrole.id, "User no longer boosting")
            TAChannel.createMessage(`**A member of TA has left us, thanks to ${member.mention} for their contributions!`)
        }

        return Promise.resolve();
    }
}

module.exports = TeamAvatar;
