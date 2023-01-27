const { Listener } = require('axoncore');

class guildRoleCreate extends Listener {
    /**
     * @param {import('axoncore').Module} module
     * @param {import('axoncore').ListenerData} data
     */
    constructor(module, data = {} ) {
        super(module, data);

        /** Event Name (Discord name) */
        this.eventName = 'guildRoleCreate';
        /** Event name (Function name) */
        this.label = 'guildRoleCreate';

        this.enabled = true;

        this.info = {
            description: 'Logs role creations',
        };
    }

    /**
     * @param {import('eris').Message} msg
     */

    async execute(guild, role) { // eslint-disable-line
        let embed = {
            color: this.utils.getColor('green'),
            description: `**Role created - <@&${role.id}>**`,
            timestamp: new Date()
        };
        
        await this.bot.getChannel('1008421501487304844').createMessage({embed})
    }
}

module.exports = guildRoleCreate;
