const { Listener } = require('axoncore');

const LOG_CHANNEL = '983618760525090869';

class DMLogs extends Listener {
    /**
     * @param {import('axoncore').Module} module
     * @param {import('axoncore').ListenerData} data
     */
    constructor(module, data = {} ) {
        super(module, data);

        /** Event Name (Discord name) */
        this.eventName = 'messageCreate';
        /** Event name (Function name) */
        this.label = 'DMLogs';

        this.enabled = true;

        this.info = {
            description: 'Logs DMs sent to Naga. Experimental feature, might break',
        };
    }

    /**
     * @param {import('eris').Message} msg
     */

     async execute(msg) { // eslint-disable-line

        let embed = {
            author: { name: this.utils.fullName(member), icon_url: msg.author.avatarURL },
            color: this.utils.getColor('blue'),
            title: 'New Message',
            footer: { text: `User ID: ${msg.author.id}` },
            timestamp: new Date()
        }

        let channel = await this.bot.getChannel(msg.channel.id);

        if (channel.type === 1) {
            embed.description = `\`\`\`${msg.content}\`\`\``
            await this.bot.getChannel(LOG_CHANNEL).createMessage({ embed: embed});
        }
        
        return Promise.resolve(); 
    } 
}

module.exports = DMLogs;
