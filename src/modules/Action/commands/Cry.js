const { Command, CommandOptions } = require('axoncore');
const images = require('../../../assets/images.json');

class Cry extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'cry';
        this.aliases = [ 'cry' ];

        this.hasSubcmd = false;

        this.info = {
            name: 'cry',
            description: 'If you are sad and you know it, send a gif!',
            usage: 'cry',
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

    async execute({ msg }) {

        let embed = {
            color: this.utils.getColor('blue'),
            description: `**${this.displayName(msg, msg.author.id)}** started crying`,
            image: { url: `https://i.imgur.com/${images.cry[Math.floor(Math.random() * images.cry.length)]}.gif` },
        };

        return msg.channel.createMessage({embed});

    }
}

module.exports = Cry;