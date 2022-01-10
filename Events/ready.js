const Chariot = require('chariot.js');
const { updateSchedulers } = require("../Util/BirthdayFunctions")

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
       updateSchedulers();
    }
}

module.exports = new Ready();