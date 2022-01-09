const Chariot = require('chariot.js');
const colour = require('../../Util/colorconfig.json')

class Poll extends Chariot.Command {
    constructor() {
        super();

        this.name = 'poll';
        this.cooldown = 5;
        this.allowDMs = false;
        this.help = {
            message: 'Creates a poll!',
            usage: 'poll question',
            example: ['poll Should I buy a dog?'],
            inline: true
        }
    }

  
    async execute(message, args, chariot) {
// Command Goes here!
 // URL checker
 let imgurl;
 args = args.join(" ");
 const urlcheck = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/.exec(args);
 if (urlcheck) args = args.slice(0, urlcheck.index) + args.slice(urlcheck.index + urlcheck[0].length, args.length);
 if (urlcheck) imgurl = urlcheck[0];
 if (!imgurl && message.attachments && message.attachments[0]) imgurl = message.attachments[0].proxy_url;
 if (!imgurl) imgurl = null;

 if(!args.length) {
     return  message.channel.createEmbed(
                         new Chariot.RichEmbed()
                             .setColor(colour.failedColour)
                             .setTitle("<:no:917982868922335272> I need something to make a poll from!")
                     )
 }


const pollmsg = await message.channel.createEmbed(
        new Chariot.RichEmbed()
        .setDescription(args)
        .setColor(colour.coreColour)
        .setAuthor(`${message.member.nick || message.author.username} asked...`, message.author.dynamicAvatarURL())
        .setThumbnail(imgurl ? imgurl : null)
        .setTimestamp(new Date)
    )

   await pollmsg.addReaction("👍").catch(() => {});
   await pollmsg.addReaction("👎").catch(() => {});







// Command Ends here
    }
}

module.exports = new Poll();