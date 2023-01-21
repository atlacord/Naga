const { Listener } = require('axoncore');

class MsgDelete extends Listener {
    /**
     * @param {import('axoncore').Module} module
     * @param {import('axoncore').ListenerData} data
     */
    constructor(module, data = {} ) {
        super(module, data);

        /** Event Name (Discord name) */
        this.eventName = 'messageDelete';
        /** Event name (Function name) */
        this.label = 'messageDelete';

        this.enabled = true;

        this.info = {
            description: 'Logs DMs sent to Naga. Experimental feature, might break',
        };
    }

    displayName(message) {
        return (message).member.nick ?? (message).member.username;
    }

    async executeHook(channel, options) {
        console.log(channel.name);
        if (channel.id in webhooks)    {
            let hook = webhooks[channel.id];
            // console.log(hook);
            await this.bot.executeWebhook(hook.id, hook.token, options);
        }
    }

    /**
     * @param {import('eris').Message} msg
     */

     async execute(msg) { // eslint-disable-line
        console.log(msg)
     }
}

module.exports = MsgDelete;
