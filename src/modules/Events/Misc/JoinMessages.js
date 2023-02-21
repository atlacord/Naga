const { Listener } = require('axoncore');

const config = require('../../../../configs/config.json');

class JoinMessages extends Listener {
    /**
     * @param {import('axoncore').Module} module
     * @param {import('axoncore').ListenerData} data
     */
    constructor(module, data = {} ) {
        super(module, data);

        /** Event Name (Discord name) */
        this.eventName = 'guildMemberAdd';
        /** Event name (Function name) */
        this.label = 'guildMemberAdd';

        this.enabled = true;

        this.info = {
            description: 'Naga join messages (for when appa goes down)',
        };
    }

    /**
     * @param {import('eris').Message} msg
     */

    async execute(guild, member) { // eslint-disable-line
        if (config.settings.joinLogs === true) {
            let joinmsg = Math.floor(Math.random() * messages.length);
            let msg = messages[joinmsg]
            msg = msg.replace(/['"]+/g, "'")
            msg = msg.replace(/{\w[{USER}]+/g, `${member.mention}`);
            await this.bot.getChannel('761932923217379338').createMessage(msg);
        }
    }
}

module.exports = JoinMessages;
