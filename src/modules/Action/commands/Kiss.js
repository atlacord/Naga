const { Command, CommandOptions } = require('axoncore');
const images = require('../../../assets/images.json');

class Kiss extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'kiss';
        this.aliases = [ 'kiss' ];

        this.hasSubcmd = false;

        this.info = {
            name: 'kiss',
            description: 'Kiss someone!',
            usage: 'kiss [user]',
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

        if (!args) return this.sendError(msg.channel, `I sowwy u can't kiss air!`);

        let embed = {
            color: this.utils.getColor('blue'),
            description: `**${this.displayName(msg, msg.author.id)}** just kissed **${this.displayName(msg, member.id)}**!`,
            image: { url: `https://i.imgur.com/${images.kiss[Math.floor(Math.random() * images.kiss.length)]}.gif` },
        };

        if (member.id === this.bot.user.id) embed.description = `0.o`;

        return msg.channel.createMessage({embed});

    }
}


module.exports = Kiss;