const Chariot = require('chariot.js');
const colour = require('../../Util/colorconfig.json')
const questions = require('../../Assets/wyr.json')

class Wyr extends Chariot.Command {
    constructor() {
        super();

        this.name = 'wyr';
        this.cooldown = 5;
        this.allowDMs = false;
        this.help = {
            message: 'Gives a would your rather question!',
            usage: 'wyr',
            example: ['wyr'],
            inline: true
        }
    }

  
    async execute(message, args, chariot) {
// Command Goes here!
var messagetext =  questions[Math.floor(Math.random() * questions.length)]
var question = messagetext.split("Would you rather ")[1]
var Option1 = question.split(" or ")[0]
var Option2 = question.split(" or ")[1]

const reply = new Chariot.RichEmbed()
        .setTitle("Let's play Would you Rather!")
        .setDescription(`Would you rather \n 🅰️ ${Option1} \n or \n :regional_indicator_b: ${Option2}`)



message.channel.createEmbed(reply).then(embedMessage => {
    embedMessage.addMessageReaction('🅰️');
    embedMessage.addMessageReaction('🇧');
  });
  //  wyrmessage = await message.channel.createEmbed(reply)

    }
}

module.exports = new Wyr();