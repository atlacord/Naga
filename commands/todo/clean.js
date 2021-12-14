const Chariot = require('chariot.js');
const colour = require('../../Util/colorconfig.json')

class Clean extends Chariot.Command {
    constructor() {
        super();

        this.name = 'clean';
        this.cooldown = 5;
        this.allowDMs = false;
        this.userPermissions = ['manageMessages']
        this.permissions = ['manageMessages', 'sendMessages']
        this.help = {
            message: 'Cleans a set amount of messages!',
            usage: 'clean amount',
            example: ['clean 27'],
            inline: true
        }
    }

  
    async execute(message, args, chariot) {
// Command Goes here!
const messageAmount = args[0]
if(!messageAmount) {
return  message.channel.createEmbed(
                    new Chariot.RichEmbed()
                        .setColor(colour.failedColour)
                        .setTitle("<:no:917982868922335272> Please lemme know how many messages to delete!")
                )
}
if (isNaN(messageAmount)) {
    return  message.channel.createEmbed(
                        new Chariot.RichEmbed()
                            .setColor(colour.failedColour)
                            .setTitle("<:no:917982868922335272> Oi! That's not a number!")
                    )
}
if(messageAmount > 100) {
    return  message.channel.createEmbed(
                        new Chariot.RichEmbed()
                            .setColor(colour.failedColour)
                            .setTitle("<:no:917982868922335272> I can only delete up to 100 messages at a time!")
                    )
}
if (messageAmount < 0) {
    return  message.channel.createEmbed(
                        new Chariot.RichEmbed()
                            .setColor(colour.failedColour)
                            .setTitle("<:no:917982868922335272> You tryna trick me with negative numbers? 0.o")
                    )
}
parseInt(messageAmount)

let msgs = await message.channel.getMessages(100)
let filtered = await msgs.filter(m => m.author.id === chariot.user.id)
message.channel.deleteMessages(filtered.map(a => a.id), messageAmount)
message.channel.createEmbed(
                    new Chariot.RichEmbed()
                        .setColor(colour.successColour)
                        .setTitle(`<:twoyes:746133145195118634> Cleared \`${messageAmount}\` messages`)
                )



// Commamnd Ends here
    }
}

module.exports = new Clean();