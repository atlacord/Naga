const { Module, CommandPermissions } = require('axoncore');

const commands = require('./commands/index');

class Games extends Module {
    /**
     * @param {import('axoncore').AxonClient} client
     * @param {import('axoncore').ModuleData} data
     */
    constructor(client, data = {} ) {
        super(client, data);

        this.label = 'Games';

        this.enabled = true;
        this.serverBypass = true;

        this.info = {
            name: 'Games',
            description: 'Games',
        };

        /**
         * @type {CommandPermissions}
         */
        this.permissions = new CommandPermissions(this, {}, true);
    }

    init() {
        return { commands };
    }
}

module.exports = Games;
