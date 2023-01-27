const { Listener } = require('axoncore');

class guildRoleDelete extends Listener {
    /**
     * @param {import('axoncore').Module} module
     * @param {import('axoncore').ListenerData} data
     */
    constructor(module, data = {} ) {
        super(module, data);

        /** Event Name (Discord name) */
        this.eventName = 'guildRoleDelete';
        /** Event name (Function name) */
        this.label = 'guildRoleDelete';

        this.enabled = true;

        this.info = {
            description: 'Logs role deletions',
        };
    }

    /**
     * @param {import('eris').Message} msg
     */

    async execute(guild, role) { // eslint-disable-line
        let embed = {
            color: this.utils.getColor('red'),
            description: `**Role deleted - ${role.name}**`,
            timestamp: new Date()
        };
        
        await this.bot.getChannel('1008421501487304844').createMessage({embed})
    }
}

module.exports = guildRoleDelete;
