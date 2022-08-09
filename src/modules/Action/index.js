const { Module } = require('axoncore');

const commands = require('./commands/index');

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
            description: 'Images for the weebs',
        };
    }

    init() {
        return { commands };
    }
}

module.exports = Action;