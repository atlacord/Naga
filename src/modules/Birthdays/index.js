const { Module, CommandPermissions } = require('axoncore');
const profile = require('../../Models/Profile');
const cron = require('node-cron');
const moment = require('moment');

const commands = require('./commands/index');

class Birthdays extends Module {
    /**
     * @param {import('axoncore').AxonClient} client
     * @param {import('axoncore').ModuleData} data
     */
    constructor(client, data = {} ) {
        super(client, data);

        this.label = 'Birthdays';

        this.enabled = true;
        this.serverBypass = true;

        this.info = {
            name: 'Birthdays',
            description: 'Checks for members\' birthdays, and sends a message for them on the day of',
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

module.exports = Birthdays;
