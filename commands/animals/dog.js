const Chariot = require('chariot.js');
const colour = require('../../Util/colorconfig.json')
const superagent = require('superagent')
const {
    AnimeDogArray,
    NigouArray,
    TwoDogArray,
} = require('../../Assets/dogarrays.json')

class Dog extends Chariot.Command {
    constructor() {
        super();

        this.name = 'dog';
        this.cooldown = 5;
        this.allowDMs = false;
        this.subcommands = ['nigou', 'anime', 'twodog']
        this.help = {
            message: 'Sends a picture of a dog!',
            usage: 'dog',
            example: ['dog'],
            inline: true
        }
    }

  // Nigou Subcommand
async nigou(message, args, chariot) {
   var randomNumber = Math.floor(Math.random() * NigouArray.length);
   message.channel.createEmbed(
    new Chariot.RichEmbed()
    .setColor('RANDOM')
    .setTitle(`<:twoaww:504747816992636939> Nigou's here!`)
    .setImage(NigouArray[randomNumber])
)
};
// Aniem Subcommand
async anime(message, args, chariot) {
    var randomNumber = Math.floor(Math.random() * AnimeDogArray.length);
    message.channel.createEmbed(
     new Chariot.RichEmbed()
     .setColor('RANDOM')
     .setTitle(`<:twoaww:504747816992636939> Anime pupper on it's way to you!`)
     .setImage(AnimeDogArray[randomNumber])
 )
 }


// Subcommand 3
async twodog(message, args, chariot) {
    var randomNumber = Math.floor(Math.random() * TwoDogArray.length);
    message.channel.createEmbed(
     new Chariot.RichEmbed()
     .setColor('RANDOM')
     .setTitle(`<:twoaww:504747816992636939> Woah, it's one of the TwoDog pfp dogs!`)
     .setImage(NigouArray[randomNumber])
 )
 }




    async execute(message, args, chariot) {
// Command Goes here!






superagent.get('http://random.dog/woof').then(res => {
    message.channel.createEmbed(
            new Chariot.RichEmbed()
            .setColor('RANDOM')
            .setTitle(`<:twoaww:504747816992636939> Cute Pupper inbound!`)
            .setImage(`http://random.dog/` + res.text)
        )
})

// Comamnd Ends here!
    }
}

module.exports = new Dog();