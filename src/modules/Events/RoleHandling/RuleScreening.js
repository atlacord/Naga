const { Listener, Guild, Message } = require('axoncore');

class RuleScreening extends Listener {
    /**
     * @param {import('axoncore').Module} module
     * @param {import('axoncore').ListenerData} data
     */
    constructor(module, data = {} ) {
        super(module, data);

        /** Event Name (Discord name) */
        this.eventName = 'guildMemberUpdate';
        /** Event name (Function name) */
        this.label = 'RuleScreening';

        this.enabled = true;

        this.info = {
            description: 'Tracks new members, adds the Nonbender role if they pass member screening.',
        };
    }

    /**
     * @param {import('eris').Guild} guild
     * @param {import('eris').Member} member
     * @param {Object} oldMember
     * @param {import('axoncore').GuildConfig} guildConfig
     */

     async execute(guild, member, oldMember, guildConfig) { // eslint-disable-line

        if (oldMember.pending === true && member.pending === false) { // If member did not previously have the TA role but since received it
            guild.addMemberRole(member.id, '372093851600683011', 'Member passed member screening')
        }
        
        return Promise.resolve(); 
    } 
}

module.exports = RuleScreening;
