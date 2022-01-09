const Chariot = require('chariot.js');
const colour = require('../../Util/colorconfig.json')
const ISOcodes = [
    "auto", "af", "sq", "am", "ar", "hy", "az", "eu", "be", "bn", "bs", "bg", "ca",
    "ceb", "ny", "zh-cn", "zh-tw", "co", "hr", "cs", "da", "nl", "en", "eo", "et",
    "tl", "fi", "fr", "fy", "gl", "ka", "de", "el", "gu", "ht", "ha", "haw", "iw",
    "hi", "hmn", "hu", "is", "ig", "id", "ga", "it", "ja", "jw", "kn", "kk", "km",
    "ko", "ku", "ky", "lo", "la", "lv", "lt", "lb", "mk", "mg", "ms", "ml", "mt",
    "mi", "mr", "mn", "my", "ne", "no", "ps", "fa", "pl", "pt", "ma", "ro", "ru",
    "sm", "gd", "sr", "st", "sn", "sd", "si", "sk", "sl", "so", "es", "su", "sw",
    "sv", "tg", "ta", "te", "th", "tr", "uk", "ur", "uz", "vi", "cy", "xh", "yi",
    "yo", "zu",
];
const fetch = require("node-fetch")

class Translate extends Chariot.Command {
    constructor() {
        super();

        this.name = 'translate';
        this.cooldown = 5;
        this.allowDMs = false;
        this.permissions = ['sendMessages']
        this.help = {
            message: 'Transaltes text!',
            usage: 'translate locale text',
            example: ['translate en 犬'],
            inline: true
        }
    }

  
    async execute(message, args, chariot) {
// Command Goes here!
if(!args.length) {
    return  message.channel.createEmbed(
                        new Chariot.RichEmbed()
                            .setColor(colour.failedColour)
                            .setTitle("<:no:917982868922335272> I need sumthin to translate!")
                    )
}
let locale = "en";
if (args[0].toLowerCase().startsWith("se ")) {
    locale = "sv";
    args.shift();
  } else if (args[0].toLowerCase().startsWith("jp ")) {
    locale = "ja";
    args.shift();
  } else if (args[0].toLowerCase().startsWith("br ")) {
    locale = "pt";
    args.shift();
  }

  if (ISOcodes.includes(args[0].toLowerCase())) {
    locale = args.shift().toLowerCase();
  }
  
  const body = await fetch(
    "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto" +
    `&tl=${locale}&dt=t&q=${encodeURIComponent(args.join(" "))}`,
  ).then(res => res.json().catch(() => {}));

 if (!body || !body[0] || !body[0][0] || !body[0][0][1] || !body[2]) {
        return this.bot.embed("❌ Error", "No translation found.", msg, "error");
      }

      message.channel.createEmbed(
              new Chariot.RichEmbed()
                .setTitle("**Translation**")
                .setDescription(`${body[0][0][1]} **(${body[2].toUpperCase()})** ➜ ${body[0][0][0]} **(${locale.toUpperCase()})**`)
                .setAuthor("Google Translate", `https://cdn3.iconfinder.com/data/icons/google-suits-1/32/18_google_translate_text_language_translation-512.png`)
                .setColor(colour.coreColour)
                .setTimestamp(new Date)
                .setFooter("Requested by " + message.author.username, message.author.dynamicAvatarURL)

          )




// Command Ends here
    }
}

module.exports = new Translate();