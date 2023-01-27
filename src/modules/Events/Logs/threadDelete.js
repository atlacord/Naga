const { Listener } = require('axoncore');

class threadDelete extends Listener {
    /**
     * @param {import('axoncore').Module} module
     * @param {import('axoncore').ListenerData} data
     */
    constructor(module, data = {} ) {
        super(module, data);

        /** Event Name (Discord name) */
        this.eventName = 'threadDelete';
        /** Event name (Function name) */
        this.label = 'threadDelete';

        this.enabled = true;

        this.info = {
            description: 'Logs thread deletions',
        };
    }

    /**
     * @param {import('eris').Message} msg
     */

    async execute(thread) { // eslint-disable-line
        let parent = await this.bot.getChannel(thread.parentID);
        let embed = {
            color: this.utils.getColor('red'),
            description: `**Thread deleted - #${thread.name}**`,
            footer: { text: `Parent Channel: #${parent.name}` },
            timestamp: new Date()
        };
        
        await this.bot.getChannel('1008421501487304844').createMessage({embed})
    }
}

module.exports = threadDelete;
