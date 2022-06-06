const { Module } = require('axoncore');

const commands = require('./commands/index');

class Manager extends Module {
    /**
     * @param {import('axoncore').AxonClient} client
     * @param {import('axoncore').ModuleData} data
     */
    constructor(client, data = {} ) {
        super(client, data);

        this.label = 'Manager';

        this.enabled = true;
        this.serverBypass = true;

        this.info = {
            name: 'Manager',
            description: 'Commands accessible by Server Managers',
        };
    }

    init() {
        return { commands };
    }
}

module.exports = Manager;