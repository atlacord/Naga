const Chariot = require('chariot.js');
const colour = require('../../Util/colorconfig.json')
const topicSchema = require('../../schemas/topics')


class Topics extends Chariot.Command {
    constructor() {
        super();

        this.name = 'topics';
        this.subcommands = ['add' ,'remove']
        this.cooldown = 5;
        this.allowDMs = false;
        this.owner = true;
        this.help = {
            message: 'Provides a random topic!',
            usage: 'topics',
            example: ['topic', 'topic list', 'topic add What is your favourite dog breed?', 'topic remove 1'],
            inline: true
        }
    }

async add(message, args, chariot) {
    const text = args.join(' ')
    const topic = {
       topic: text
    }
    
    await new topicSchema(topic).save()
    
    message.channel.createEmbed(
                        new Chariot.RichEmbed()
                            .setColor(colour.successColour)
                            .setTitle(`<:twoyes:746133145195118634> Added topic: **${text}**`)
                    )    
}
async remove(message, args, chariot) {
    const rid = parseInt(args)
    await topicSchema.findByIdAndDelete(rid, {})  
    message.channel.createEmbed(
                        new Chariot.RichEmbed()
                            .setColor(colour.successColour)
                            .setTitle(`<:twoyes:746133145195118634> Removed topic: **${rid}**`)
                    )    
}


    
async execute(message, args, chariot) {
// Command Goes here!






// Command Ends here 

    }
}

module.exports = new Topics();