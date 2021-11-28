const Chariot = require('chariot.js');

/**
 * This command will never be loaded because the directory it lies in is ignored in the Chariot.js client options!
 */
class Secret extends Chariot.Command {
    constructor() {
        super();

        this.name = 'secret';
        this.cooldown = 5;
        this.owner = true;
        this.allowDMs = false;
        this.help = {
            message: 'A super secret command',
            usage: 'secret',
            example: ['secret'],
            inline: true
        }
    }

    /**
     *  This is the main method getting executed by the MessageHandler upon a valid command request
     * 
     * @param {Object} message The emitted message object that triggered this command  
     * @param {String[]} args The arguments fetched from using the command
     * @param {Object} chariot The bot client itself
     */
    async execute(message, args, chariot) {
        message.channel.createMessage("Welcome to the secret land!");
    }
}

module.exports = new Secret();