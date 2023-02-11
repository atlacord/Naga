const { Command, CommandOptions } = require('axoncore');
const images = require('../../../assets/images.json');

class Blush extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'blush';
        this.aliases = [ 'blush' ];

        this.hasSubcmd = false;

        this.info = {
            name: 'blush',
            description: 'Blush',
            usage: 'blush',
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

        let embed = {
            color: this.utils.getColor('blue'),
            description: `**${this.displayName(msg, msg.member.id)}** blushes`,
            image: { url: `https://i.imgur.com/${images.blush[Math.floor(Math.random() * images.blush.length)]}.gif` },
        };
        return msg.channel.createMessage({embed});

        }
}


module.exports = Blush;