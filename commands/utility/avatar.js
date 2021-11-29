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








/*
 if(message.mentions[0] !== undefined) {
   return message.channel.createEmbed(
           new Chariot.RichEmbed()
            .setAuthor(message.mentions[0].username + '#' + message.mentions[0].discriminator + `'s Avatar!`, message.mentions[0].dynamicAvatarURL())
            .setColor(colour.coreColour)
            .setImage(message.mentions[0].dynamicAvatarURL(null, 1024))
       )
} else if (chariot.users.get(args[0] !== undefined)) {
    const id = (args[0].match(/\d{17,19}/)||[])[0] 
    const member = message.channel.guild.members.find(id)
    return message.channel.createEmbed(
        new Chariot.RichEmbed()
         .setAuthor(member.user.username + '#' + member.user.discriminator + `'s Avatar!`, member.user.dynamicAvatarURL())
         .setColor(colour.coreColour)
         .setImage(args[0].dynamicAvatarURL(null, 1024))
    )
} else if (args.join(" ") !== "") {
    const userRegex = new RegExp(args.join("|"), "i");
    const member = message.channel.guild.members.find(element => {
        return userRegex.test(element.nick) ? userRegex.test(element.nick) : userRegex.test(element.username);
    });
    let image = member ? member.user.dynamicAvatarURL(null, 1024) : message.author.dynamicAvatarURL(null, 1024);
    return message.channel.createEmbed(
        new Chariot.RichEmbed()
         .setAuthor(member.user.username + '#' + member.user.discriminator +`'s Avatar!`, image)
         .setColor(colour.coreColour)
         .setImage(image)
    )
} else { 
    return message.channel.createEmbed(
        new Chariot.RichEmbed()
         .setAuthor(message.author.username + '#' + message.author.discriminator + `'s Avatar!`, message.author.dynamicAvatarURL())
         .setColor(colour.coreColour)
         .setImage(message.author.dynamicAvatarURL(null, 1024))
    )
}
 */

// Command End!
}
}

module.exports = new Avatar();