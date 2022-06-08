const { Module, CommandPermissions } = require('axoncore');

const commands = require('./commands/index');

class Social extends Module {
    /**
     * @param {import('axoncore').AxonClient} client
     * @param {import('axoncore').ModuleData} data
     */
    constructor(client, data = {} ) {
        super(client, data);

        this.label = 'Social';

        this.enabled = true;
        this.serverBypass = true;

        this.info = {
            name: 'Social',
            description: 'Social commands',
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

module.exports = Social;
