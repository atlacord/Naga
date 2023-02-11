const { Command, CommandOptions } = require('axoncore');
const images = require('../../../assets/images.json');

class Boop extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'boop';
        this.aliases = [ 'boop' ];

        this.hasSubcmd = false;

        this.info = {
            name: 'boop',
            description: 'Boop someone!',
            usage: 'boop [user]',
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

        console.log(member);

        if (member.id === msg.author.id) return this.sendError(msg.channel, `Nah mate can't boop urself`);

        let embed = {
            color: this.utils.getColor('blue'),
            description: `**${this.displayName(msg, member.id)}** faces a good 'ol slap from **${this.displayName(msg, msg.author.id)}**! I wonder what they did to deserve that...`,
            image: { url: `https://c.tenor.com/fxIMcE41WpgAAAAd/tenor.gif` },
        };

        return msg.channel.createMessage({embed});

    }
}


module.exports = Boop;