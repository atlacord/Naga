const { Module } = require('axoncore');

const commands = require('./commands/index');

class Info extends Module {
    /**
     * @param {import('axoncore').AxonClient} client
     * @param {import('axoncore').ModuleData} data
     */
    constructor(client, data = {} ) {
        super(client, data);

        this.label = 'Info';

        this.enabled = true;
        this.serverBypass = true;

        this.info = {
            name: 'Info',
            description: 'The main module with most basic commands.',
        };
    }

    init() {
        return { commands };
    }
}

module.exports = Info;
