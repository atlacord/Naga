const { Listener } = require('axoncore');

class channelDelete extends Listener {
    /**
     * @param {import('axoncore').Module} module
     * @param {import('axoncore').ListenerData} data
     */
    constructor(module, data = {} ) {
        super(module, data);

        /** Event Name (Discord name) */
        this.eventName = 'channelDelete';
        /** Event name (Function name) */
        this.label = 'channelDelete';

        this.enabled = true;

        this.info = {
            description: 'Logs channel deletions',
        };
    }

    /**
     * @param {import('eris').Message} msg
     */

    async execute(channel) { // eslint-disable-line   
        let embed = {
            color: this.utils.getColor('red'),
            description: `**Channel deleted - #${channel.name}**`,
            footer: { text: `Channel ID: ${channel.id}` },
            timestamp: new Date()
        };
        
        await this.bot.getChannel('1008421501487304844').createMessage({embed})
    }
}

module.exports = channelDelete;
