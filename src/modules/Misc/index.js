const { Module, CommandPermissions } = require('axoncore');

const commands = require('./commands/index');
// const listeners = require('./commands/index');

class Misc extends Module {
    /**
     * @param {import('axoncore').AxonClient} client
     * @param {import('axoncore').ModuleData} data
     */
    constructor(client, data = {} ) {
        super(client, data);

        this.label = 'Misc';

        this.enabled = true;
        this.serverBypass = true;

        this.info = {
            name: 'Misc',
            description: 'Misc commands',
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

module.exports = Misc;
