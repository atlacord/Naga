const Chariot = require('chariot.js');
const colour = require('../../Util/colorconfig.json')
const superagent = require('superagent')

class Cat extends Chariot.Command {
    constructor() {
        super();

        this.name = 'cat';
        this.cooldown = 5;
        this.allowDMs = false;
        this.help = {
            message: 'Sends a picture of a cat!',
            usage: 'cat',
            example: ['cat'],
            inline: true
        }
    }

  
    async execute(message, args, chariot) {
// Command Goes here!
superagent.get('http://aws.random.cat/meow').then(res => {
    message.channel.createEmbed(
            new Chariot.RichEmbed()
            .setColor('RANDOM')
            .setTitle(`<:twoaww:504747816992636939> Not as good as a dog, but here's a cute cat!`)
            .setImage(res.body.file)
        )
})

// Comamnd Ends here!
    }
}

module.exports = new Cat();