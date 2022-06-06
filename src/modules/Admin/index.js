const { Module, CommandPermissions } = require('axoncore');

const commands = require('./commands/index');
// const listeners = require('./commands/index');

class Admin extends Module {
    /**
     * @param {import('axoncore').AxonClient} client
     * @param {import('axoncore').ModuleData} data
     */
    constructor(client, data = {} ) {
        super(client, data);

        this.label = 'Admin';

        this.enabled = true;
        this.serverBypass = true;

        this.info = {
            name: 'Admin',
            description: 'Very Private. Much Dev. Wow.',
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

module.exports = Admin;
