const Chariot = require('chariot.js');
const { now } = require('mongoose');
const colour = require('../../Util/colorconfig.json')
/**
 * This example is an extremely basic command example of how a command could look like and work with Chariot.js
 */

class Ping extends Chariot.Command {
    constructor() {
        super();

        this.name = 'ping';
        this.cooldown = 3;
        this.help = {
            message: 'Want a quick game of ping pong?',
            usage: 'ping',
            example: ['ping'],
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
    message.channel.createEmbed(new Chariot.RichEmbed()
        .setColor(colour.coreColour)
        .setDescription(`<:twohi:504747816405696513> Bork! That round trip took me: **${Date.now() - message.createdAt} ms**`)
    );
    }
}

module.exports = new Ping();