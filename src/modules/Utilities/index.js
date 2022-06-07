const { Module, CommandPermissions } = require('axoncore');

const commands = require('./commands/index');

class Utilities extends Module {
    /**
     * @param {import('axoncore').AxonClient} client
     * @param {import('axoncore').ModuleData} data
     */
    constructor(client, data = {} ) {
        super(client, data);

        this.label = 'Utilities';

        this.enabled = true;
        this.serverBypass = true;

        this.info = {
            name: 'Utilities',
            description: 'Server utilities',
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

module.exports = Utilities;
