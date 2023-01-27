const { Listener } = require('axoncore');

class threadCreate extends Listener {
    /**
     * @param {import('axoncore').Module} module
     * @param {import('axoncore').ListenerData} data
     */
    constructor(module, data = {} ) {
        super(module, data);

        /** Event Name (Discord name) */
        this.eventName = 'threadCreate';
        /** Event name (Function name) */
        this.label = 'threadCreate';

        this.enabled = true;

        this.info = {
            description: 'Logs thread creations',
        };
    }

    /**
     * @param {import('eris').Message} msg
     */

    async execute(thread) { // eslint-disable-line
        let parent = await this.bot.getChannel(thread.parentID);
        
        let embed = {
            color: this.utils.getColor('green'),
            description: `**Thread created - #${thread.name}**`,
            footer: { text: `Parent Channel: ${parent.name}` },
            timestamp: new Date()
        };
        
        await this.bot.getChannel('1008421501487304844').createMessage({embed})
    }
}

module.exports = threadCreate;
