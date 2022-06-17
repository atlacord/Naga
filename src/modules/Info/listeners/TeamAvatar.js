const { Listener } = require('axoncore');

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
        return Promise.resolve();
    }
}

module.exports = TeamAvatar;
