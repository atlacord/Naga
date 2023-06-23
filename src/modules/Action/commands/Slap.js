const { Command, CommandOptions } = require('axoncore');
const images = require('../../../assets/images.json');

class Slap extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'slap';
        this.aliases = [ 'slap' ];

        this.hasSubcmd = false;

        this.info = {
            name: 'slap',
            description: 'Slap someone!',
            usage: 'slap [user]',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 0,
            cooldown: 10000,
            guildOnly: true,
        } );
    }

    displayName(message, member) {
        return (message).channel.guild.members.get(member).nick ?? (message).channel.guild.members.get(member).username;
    }

    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    async execute({ msg, args }) {

        let member = this.utils.resolveUser(msg.channel.guild, args[0]);

        let embed = {
            color: this.utils.getColor('blue'),
            description: `**${this.displayName(msg, member.id)}** faces a good 'ol slap from **${this.displayName(msg, msg.author.id)}**! I wonder what they did to deserve that...`,
            image: { url: `https://i.imgur.com/${images.slap[Math.floor(Math.random() * images.slap.length)]}.gif` },
            footer: { text: `Requested by: ${this.utils.fullName(msg.author)}` }
        };

        if (member.id === msg.author.id) embed.description = `**${this.displayName(msg, msg.author.id)}** slaps themselves!`;
        if (member.id === this.bot.user.id) embed.description = [`Owie!`,`Oi u couldn't handle the jandal!`,`Not very nice of you!`][Math.floor(Math.random() * 3)];

        return msg.channel.createMessage({embed});

    }
}


module.exports = Slap;