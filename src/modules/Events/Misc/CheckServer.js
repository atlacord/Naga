const { Listener } = require('axoncore');

class CheckServer extends Listener {
    /**
     * @param {import('axoncore').Module} module
     * @param {import('axoncore').ListenerData} data
     */
    constructor(module, data = {} ) {
        super(module, data);

        /** Event Name (Discord name) */
        this.eventName = 'guildCreate';
        /** Event name (Function name) */
        this.label = 'CheckServer';

        this.enabled = true;

        this.info = {
            description: 'Checks servers, leaves if they aren\'t ATLA or a test server',
        };
    }

    async checkGuild(id) {
        let servers = [
            '370708369951948800', // ATLA
            '504742982604554241', // TwoDog Fan Club
            '546800805060280352' // Test Lab (soda testing server)
        ]

        if (!servers.includes(id)) {
            return false;
        } else {
            return true;
        }
    }

    execute(guild) {
        console.log(`New server: ${guild.name} (${guild.id})`)

        let status = this.checkGuild(guild.id);

        if (status === false) {
            return guild.leave();
        }
    }
}

module.exports = CheckServer;