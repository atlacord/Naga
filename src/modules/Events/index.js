const { Module } = require('axoncore');

const listeners = require('./listeners/index');

class Events extends Module {
    /**
     * @param {import('axoncore').AxonClient} client
     * @param {import('axoncore').ModuleData} data
     */
    constructor(client, data = {} ) {
        super(client, data);

        this.label = 'Events';

        this.enabled = true;
        this.serverBypass = true;

        this.info = {
            name: 'Events',
            description: 'Naga\'s event handler',
        };
    }

    init() {
        return { listeners };
    }
}

module.exports = Events;
