const { Module } = require('axoncore');

const commands = require('./commands/index');

class Anime extends Module {
    /**
     * @param {import('axoncore').AxonClient} client
     * @param {import('axoncore').ModuleData} data
     */
    constructor(client, data = {} ) {
        super(client, data);

        this.label = 'Anime';

        this.enabled = true;
        this.serverBypass = true;

        this.info = {
            name: 'Anime',
            description: 'Commands for the weebs',
        };
    }

    init() {
        return { commands };
    }
}

module.exports = Anime;