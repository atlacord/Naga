const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const fetch = require("node-fetch");
const MessageEmbed = require("davie-eris-embed")
// const axios = require('axios');

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
            usage: 'hug <user>',
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

        let member = args[0].replace('<@','');
        member = member.replace('>', '').toString();
        member = await this.bot.getRESTGuildMember(msg.guildID, member) || msg.member;

    if(member.id === msg.author.id) return this.sendError(msg.channel, `Nah mate can't hug urself innit`)
    const { url } = await fetch("https://nekos.life/api/v2/img/hug")
    .then((res) => res.json());

    const embed = new MessageEmbed()
    .setTitle("<:twoaww:307378440653373441>")
    .setColor(this.utils.getColor('blue').toString(16))
    .setDescription(`**${this.displayName(msg, member.id)}**, you just got hugged by **${this.displayName(msg, msg.author.id)}**`)
    .setImage(url)
    .setFooter(`Requested by: ${msg.author.username}#${msg.author.discriminator}`, msg.author.avatarURL);

    return msg.channel.createMessage(embed.create);

    }
}


module.exports = Hug;
