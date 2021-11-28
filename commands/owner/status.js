const Chariot = require('chariot.js');
const colour = require('../../Util/colorconfig.json')

class Status extends Chariot.Command {
    constructor() {
        super();

        this.name = 'status';
        this.cooldown = 5;
        this.owner = true;
        this.allowDMs = false;
        this.help = {
            message: 'Change my status!',
            usage: 'status ',
            example: [''],
            inline: true
        }
    }

  
    async execute(message, args, chariot) {
// Command Goes here!
        let words = args.join(' ')
        chariot.editStatus('Online', {name: words});
        message.channel.createEmbed(new Chariot.RichEmbed()
        .setColor(colour.coreColour)
        .setDescription("<:twoyes:746133145195118634> **Status changed to:** " + words)
        )
    }
}

module.exports = new Status();