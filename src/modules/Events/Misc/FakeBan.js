const { Listener } = require('axoncore');

class FakeBan extends Listener {
    /**
     * @param {import('axoncore').Module} module
     * @param {import('axoncore').ListenerData} data
     */
    constructor(module, data = {} ) {
        super(module, data);

        /** Event Name (Discord name) */
        this.eventName = 'messageCreate';
        /** Event name (Function name) */
        this.label = 'fakeBan';

        this.enabled = true;

        this.info = {
            description: 'The infamous fake ban command',
        };
    }

    /**
     * @param {import('eris').Message} msg
     */

    async execute(msg) { // eslint-disable-line
        if (msg.author.bot) return;
        if (msg.content.startsWith('-ban')) {//'—ban' || '--ban')) {
            msg.channel.createMessage(`Ban hammer dropped on ${msg.content.slice(5)}!`);
        }
    }
}

module.exports = FakeBan;
