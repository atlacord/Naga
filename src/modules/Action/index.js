const { Module, CommandPermissions } = require('axoncore');

const commands = require('./commands/index');
// const listeners = require('./commands/index');

class Action extends Module {
    /**
     * @param {import('axoncore').AxonClient} client
     * @param {import('axoncore').ModuleData} data
     */
    constructor(client, data = {} ) {
        super(client, data);

        this.label = 'Action';

        this.enabled = true;
        this.serverBypass = true;

        this.info = {
            name: 'Action',
            description: 'Just lots of weeb gifs really',
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

module.exports = Action;
