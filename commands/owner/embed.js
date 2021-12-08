const Chariot = require('chariot.js');
const colour = require('../../Util/colorconfig.json')

class Embed extends Chariot.Command {
    constructor() {
        super();

        this.name = 'embed';
        this.cooldown = 5;
        this.owner = true;
        this.allowDMs = false;
        this.subcommands = ['link']
        this.help = {
            message: 'Create embeds!',
            usage: 'embed rawembedtext',
            inline: true
        }
    }

    async link(message, args, chariot) {
        return message.channel.createMessage("Here's a handy link to use to create the raw embeds! <https://glitchii.github.io/embedbuilder/?editor-gui>")
    }

  
    async execute(message, args, chariot) {
// Command Goes here!
        const targetchannel = message.channelMentions[0]
        if (!targetchannel) { 
            return  message.channel.createEmbed(
                new Chariot.RichEmbed()
                    .setColor(colour.failedColour)
                    .setTitle("<:no:917982868922335272> **I need a channel to send to!**")
            )
        }
        if(args.length < 2) { 
            return  message.channel.createEmbed(
                new Chariot.RichEmbed()
                    .setColor(colour.failedColour)
                    .setTitle("<:no:917982868922335272> **I need the embed json to send!**")
            )
        }
    args.shift() // Removes the channel mention
    const json = JSON.parse(args.join(' '))

    const sendchannel = message.channel.guild.channels.find(c => c.id === targetchannel);

    // const sendchannel = message.channel.guild.channels.get(targetchannel.id)
    return sendchannel.createMessage(json)
  

    }
}

module.exports = new Embed();