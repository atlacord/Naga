const { Command, CommandOptions } = require('axoncore');
const fetch = require("node-fetch");

class Hug extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'hug';
        this.aliases = [ 'hug' ];

        this.hasSubcmd = false;

        this.info = {
            name: 'hug',
            description: 'Hug someone!',
            usage: 'hug [user]',
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

    async execute( { msg, args } ) {

        let member = this.utils.resolveUser(msg.channel.guild, args[0]);

        if (member.id === msg.author.id) return this.sendError(msg.channel, `Nah mate can't hug urself innit`)
        const { url } = await fetch("https://nekos.life/api/v2/img/hug")
        .then((res) => res.json());

        let embed = {
            color: this.utils.getColor('blue'),
            description: `**${this.displayName(msg, member.id)}**, you just got hugged by **${this.displayName(msg, msg.author.id)}**`,
            image: { url: url },
            footer: { text: `Requested by: ${this.utils.fullName(msg.author)}` }
        };

        return msg.channel.createMessage({embed});

    }
}


module.exports = Hug;
