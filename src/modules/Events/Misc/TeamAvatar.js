const { Listener, Guild, Message } = require('axoncore');
const profile = require('../../../Models/Profile');

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
            profile.findById(member.id, (err, doc) => {
                if (!oldMember.roles.includes('586128911302131725') && member.roles.includes('586128911302131725')) { // If member did not previously have the TA role but since received it
                this.sendMessage(TAChannel, `A new member joins the fold! A big thanks to ${member.mention} for boosting the server! Please make sure you read the pins for info on how to get the TA Colour role and more!`);
                
                if (doc.data.xpBoost.type === null) {
                    doc.data.xpBoost.type = 'booster';
                };
            }
            if (oldMember.roles.includes('586128911302131725') && !member.roles.includes('586128911302131725')) {
                if (oldMember.roles.includes('829542940707127346')) { // Checks if member had TA Colour role
                    const colourrole = guild.roles.find(r => r.id === '829542940707127346')
                    guild.removeMemberRole(member.id, colourrole.id, "User no longer boosting")
                    if (doc.data.xpBoost.type === 'booster') {
                        doc.data.xpBoost.type = null;
                    };
                }
                // this.sendMessage(TAChannel, `A member of TA has left us, thanks to ${member.mention} for their contributions!`)
            }

            return Promise.resolve(); 
        })
    } 
}

module.exports = TeamAvatar;
