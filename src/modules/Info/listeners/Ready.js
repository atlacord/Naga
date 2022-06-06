const { Listener } = require('axoncore');

class Ready extends Listener {
    /**
     * @param {import('axoncore').Module} module
     * @param {import('axoncore').ListenerData} data
     */
    constructor(module, data = {} ) {
        super(module, data);

        /** Event Name (Discord name) */
        this.eventName = 'ready';
        /** Event name (Function name) */
        this.label = 'ready';

        this.enabled = true;

        this.info = {
            description: 'Ready event',
        };
    }

    async execute() {
        let embed = {
            title: 'Online',
            description: `${this.bot.user.username} is wide awake!`,
            color: this.utils.color.blue,
            footer: { text: this.bot.user.username },
            timestamp: new Date()
        }
        
        this.sendMessage(this.config.bot.logChannel, { embed })
        this.logger.info(`Aye aye cap'n! ${this.bot.user.username} is now online!`)
    }
}

module.exports = Ready;