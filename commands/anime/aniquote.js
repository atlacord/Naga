const Chariot = require('chariot.js');
const colour = require('../../Util/colorconfig.json')
const { randomQuote } = require('animequotes')
const { searchAnime } = require('node-kitsu')

class Aniquote extends Chariot.Command {
    constructor() {
        super();

        this.name = 'aniquote';
        this.cooldown = 5;
        this.allowDMs = false;
        this.help = {
            message: 'Gets a random anime quote!',
            usage: 'aniquote',
            example: ['aniquote'],
            inline: true
        }
    }

  
    async execute(message, args, chariot) {
// Command Goes here!
const { quote, anime, id, name } = randomQuote()

let image = null 

const res = await searchAnime(anime,0).catch(()=>{})
if (res
    && res[0].attributes
    && res[0].attributes.coverImage
    && res[0].attributes.coverImage.original)
        image = res[0].attributes.coverImage.original

        message.channel.createEmbed(
                new Chariot.RichEmbed()
                .setDescription(`${quote}\n\n-*${name}*`)
                .setColor(colour.animeColour)
                .setImage(image)
                .setFooter(`Quoted from ${anime}`)
            )










// Command Ends here
    }
}

module.exports = new Aniquote();