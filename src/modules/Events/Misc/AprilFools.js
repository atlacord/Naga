const { Listener } = require('axoncore');

// const userRegex = /<@([^}]+)>/g;

class AprilFools extends Listener {
    /**
     * @param {import('axoncore').Module} module
     * @param {import('axoncore').ListenerData} data
     */
    constructor(module, data = {} ) {
        super(module, data);

        /** Event Name (Discord name) */
        this.eventName = 'messageCreate';
        /** Event name (Function name) */
        this.label = 'aprilfools2025';

        this.enabled = true;

        this.info = {
            description: 'April Fools 2025',
        };
    }

        async execute(msg) {
        if (msg.content === '51884') {
            try {
                let collection = this.bot.guilds.get('370708369951948800').members.filter(m => (!m.roles.includes('1356679046926438572')));
                for (let i of collection) {
                    this.bot.addGuildMemberRole('370708369951948800', i.id, '1315077727606276117', 'Ozakku role');
                    console.log(`Adding Ozakku role to ${this.utils.fullName(i)} (${i.id})`);
                }
            } catch (err) {
                console.log(err);
            }
        }
    }
}

module.exports = AprilFools;
