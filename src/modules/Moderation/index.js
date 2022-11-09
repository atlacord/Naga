const { Module, CommandPermissions } = require('axoncore');

const commands = require('./commands/index');

class Moderation extends Module {
    /**
     * @param {import('axoncore').AxonClient} client
     * @param {import('axoncore').ModuleData} data
     */
    constructor(client, data = {} ) {
        super(client, data);

        this.label = 'Moderation';

        this.enabled = true;
        this.serverBypass = true;

        this.info = {
            name: 'Moderation',
            description: 'Mod commands',
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

module.exports = Moderation;
