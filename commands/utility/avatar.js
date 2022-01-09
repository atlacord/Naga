const Chariot = require('chariot.js');
const colour = require('../../Util/colorconfig.json')

class Avatar extends Chariot.Command {
    constructor() {
        super();

        this.name = 'avatar';
        this.cooldown = 5;
        this.allowDMs = false;
        this.aliases = ['av', 'picof', 'pfp', 'letssee'];
        this.help = {
            message: 'Gets the avatar of a user!',
            usage: 'avatar user',
            example: ['avatar 123261299864895489'],
            inline: true
        }
    }

  
    async execute(message, args, chariot)  {
// Command Goes here!

let user = message.mentions[0] || chariot.users.get(args[0]);
if(!user) user = message.author; 

return message.channel.createEmbed(
    new Chariot.RichEmbed()
    .setAuthor(user.username + '#' + user.discriminator + `'s Avatar!`)
    .setColor(user.accentColor || colour.coreColour)
    .setImage(user.dynamicAvatarURL(null, 1024))
    .setFooter('Requested by: ' + message.author.username)
)



// Command End!
}
}

module.exports = new Avatar();