const Chariot = require('chariot.js');
const colour = require('../../Util/colorconfig.json')
const topicSchema = require('../../schemas/topics')
const atlatopic = require('../../Assets/avatartopics.json')
const topic = require('../../Assets/topics.json')


class Topic extends Chariot.Command {
    constructor() {
        super();

        this.name = 'topic';
        this.subcommands = ['atla']
        this.cooldown = 5;
        this.allowDMs = false;
        this.owner = true;
        this.help = {
            message: 'Provides a random topic!',
            usage: 'topics',
            example: ['topic', 'topic atla'],
            inline: true
        }
    }

/* async add(message, args, chariot) {
    
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
*/
/* async remove(message, args, chariot) {
    const rid = parseInt(args)
    await topicSchema.findByIdAndDelete(rid, {})  
    message.channel.createEmbed(
                        new Chariot.RichEmbed()
                            .setColor(colour.successColour)
                            .setTitle(`<:twoyes:746133145195118634> Removed topic: **${rid}**`)
                    )    
} */

async atla(message, args, chariot) {
    const randomTopic = Math.floor(Math.random() * atlatopic.length); 
    return message.channel.createEmbed(
            new Chariot.RichEmbed()
            .setColor(colour.coreColour)
            .setDescription(atlatopic[randomTopic])
        )
}


    
async execute(message, args, chariot) {
// Command Goes here!
const randomTopic = Math.floor(Math.random() * topic.length);
return message.channel.createEmbed(
        new Chariot.RichEmbed()
        .setColor(colour.coreColour)
        .setDescription(topic[randomTopic])
    )
// Command Ends here 

    }
}

module.exports = new Topic();