const { Command, CommandOptions } = require('axoncore');
const fetch = require("node-fetch");

class Feed extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'feed';
        this.aliases = [ 'feed' ];

        this.hasSubcmd = false;

        this.info = {
            name: 'feed',
            description: 'Feed someone!',
            usage: 'feed [user]',
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
            description: `**${this.displayName(msg, msg.author.id)}** feeds **${this.displayName(msg, member.id)}**!`,
            image: { url: `https://i.imgur.com/${images.feed[Math.floor(Math.random() * images.feed.length)]}.gif` },
        };

        if( member.id === msg.author.id) embed.description = `**${this.displayName(msg, msg.author.id)}** ate something delicious!`;
        if (member.id === this.bot.user.id) embed.description = 'Yummmmmmmmmy!!';

        return msg.channel.createMessage({embed});

    }
}


module.exports = Feed;
