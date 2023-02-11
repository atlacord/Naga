const { Command, CommandOptions } = require('axoncore');
const images = require('../../../assets/images.json');

class Sleep extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'sleep';
        this.aliases = [ 'sleep' ];

        this.hasSubcmd = false;

        this.info = {
            name: 'sleep',
            description: 'Put someone to sleep!',
            usage: 'sleep [user]',
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
            description: `**${this.displayName(msg, msg.author.id)}** falls sleep. Goodnight!`,
            image: { url: `https://i.imgur.com/${images.sleep[Math.floor(Math.random() * images.sleep.length)]}.gif` },
        };

        return msg.channel.createMessage({embed});

    }
}


module.exports = Sleep;