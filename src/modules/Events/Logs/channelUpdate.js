const { Listener } = require('axoncore');

class channelUpdate extends Listener {
    /**
     * @param {import('axoncore').Module} module
     * @param {import('axoncore').ListenerData} data
     */
    constructor(module, data = {} ) {
        super(module, data);

        /** Event Name (Discord name) */
        this.eventName = 'channelUpdate';
        /** Event name (Function name) */
        this.label = 'channelUpdate';

        this.enabled = true;

        this.info = {
            description: 'Logs channel updates',
        };
    }

    /**
     * @param {import('eris').Message} msg
     */

    async execute(channel, oldChannel) { // eslint-disable-line
        let send = false;
        let embed = {
            color: this.utils.getColor('green'),
            description: null,
            fields: [],
            footer: { text: `Channel ID: #${channel.id}` },
            timestamp: new Date()
        };

        if (channel.name !== oldChannel.name) {
            embed.color = this.utils.getColor('yellow');
            embed.description = `**Channel Renamed - ${channel.mention}**`;
            embed.fields.push({ name: 'Old Name', value: `#${oldChannel.name}` });
            embed.fields.push({ name: 'New Name', value: `#${channel.name}` });
            send = true;
        }

        if (channel.topic !== oldChannel.topic) {
            embed.color = this.utils.getColor('yellow');
            embed.description = `**Channel topic updated - ${channel.mention}**`;
            embed.fields.push({ name: 'Old Topic', value: `#${oldChannel.topic}` });
            embed.fields.push({ name: 'New Topic', value: `#${channel.topic}` });
            send = true;
        }

        if (channel.parentID !== oldChannel.parentID) {
            let newParent = await this.bot.getChannel(channel.parentID);
            let oldParent = await this.bot.getChannel(oldChannel.parentID);
            embed.color = this.utils.getColor('yellow');
            embed.description = `**Channel moved - ${channel.mention}**`;
            embed.fields.push({ name: 'Old Category', value: `#${oldParent.name}` });
            embed.fields.push({ name: 'New Topic', value: `#${newParent.name}` });
            send = true;
        }

        if (send === true) {
            await this.bot.getChannel('1008421501487304844').createMessage({embed})
        }
    }
}

module.exports = channelUpdate;
