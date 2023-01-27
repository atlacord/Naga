const { Listener } = require('axoncore');

class threadUpdate extends Listener {
    /**
     * @param {import('axoncore').Module} module
     * @param {import('axoncore').ListenerData} data
     */
    constructor(module, data = {} ) {
        super(module, data);

        /** Event Name (Discord name) */
        this.eventName = 'threadUpdate';
        /** Event name (Function name) */
        this.label = 'threadUpdate';

        this.enabled = true;

        this.info = {
            description: 'Logs thread updates',
        };
    }

    /**
     * @param {import('eris').Message} msg
     */

    async execute(thread, oldThread) { // eslint-disable-line
        let parent = await this.bot.getChannel(thread.parentID);
        let send = false;
        let embed = {
            color: this.utils.getColor('green'),
            description: null,
            fields: [],
            footer: { text: `Parent Channel: #${parent.name}` },
            timestamp: new Date()
        };

        if (thread.name !== oldThread.name) {
            embed.color = this.utils.getColor('yellow');
            embed.description = `**Thread Renamed**`;
            embed.fields.push({ name: 'Old Name', value: `#${oldThread.name}` });
            embed.fields.push({ name: 'New Name', value: `#${thread.name}` });
            send = true;
        }

        if (thread.threadMetadata.locked && !oldThread.threadMetadata.locked) {
            embed.color = this.utils.getColor('red');
            embed.description = `**Thread locked - ${thread.name}**`;
            send = true;
        }

        if (thread.threadMetadata.archived && !oldThread.threadMetadata.archived) {
            embed.color = this.utils.getColor('red');
            embed.description = `**Thread archived - ${thread.name}**`;
            send = true;
        }

        if (!thread.threadMetadata.locked && oldThread.threadMetadata.locked) {
            embed.color = this.utils.getColor('green');
            embed.description = `**Thread unlocked - ${thread.name}**`;
            send = true;
        }
        
        console.log(send);

        if (send === true) {
            await this.bot.getChannel('1008421501487304844').createMessage({embed})
        }
    }
}

module.exports = threadUpdate;
