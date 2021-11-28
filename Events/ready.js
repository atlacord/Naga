const Chariot = require('chariot.js');

class Ready extends Chariot.Event {
    /**
     * Instantiating the superclass with the appropriate event name
     */
    constructor() {
        super('ready');
    }

    /**
     * No parameters since the "ready" event doesn't emit any
     */
    async execute() {
       Chariot.Logger.event(`Ay Ay cap! I am ready to serve ${this.client.guilds.size} guilds!`); 
    }
}

module.exports = new Ready();