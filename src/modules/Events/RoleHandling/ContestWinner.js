const { Listener, Guild, Message } = require('axoncore');

class ContestWinner extends Listener {
    /**
     * @param {import('axoncore').Module} module
     * @param {import('axoncore').ListenerData} data
     */
    constructor(module, data = {} ) {
        super(module, data);

        /** Event Name (Discord name) */
        this.eventName = 'guildMemberUpdate';
        /** Event name (Function name) */
        this.label = 'ContestWinner';

        this.enabled = true;

        this.info = {
            description: 'Tracks Contest Winner role',
        };
    }

    /**
     * @param {import('eris').Guild} guild
     * @param {import('eris').Member} member
     * @param {Object} oldMember
     * @param {import('axoncore').GuildConfig} guildConfig
     */

     async execute(guild, member, oldMember, guildConfig) { // eslint-disable-line

        if (oldMember.roles.includes('516790566017564684') && !member.roles.includes('516790566017564684')) { // If member did not previously have the TA role but since received it
            guild.addMemberRole(member.id, '530972685610778635', 'Member no longer a current contest winner')
        }
        
        return Promise.resolve(); 
    } 
}

module.exports = ContestWinner;
