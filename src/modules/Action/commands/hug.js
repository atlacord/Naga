const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const fetch = require("node-fetch")
// const axios = require('axios');

class hug extends Command {
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
    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    async execute( { msg } ) {

    const member = msg.channel.guild.members.get(args[0]) || msg.member;

    if(member.id === msg.author.id) return this.sendError(msg.channel, `Nah mate can't hug urself innit`)
    const { url } = await fetch("https://nekos.life/api/v2/img/hug")
    .then((res) => res.json());

    const embed = new MessageEmbed()
    .setTitle("<:twoaww:307378440653373441>")
    .setDescription(`**${member.displayName}**, you just got hugged by **${msg.member.displayName}**`)
    .setImage(url)
    .setFooter(`Requested by: ${msg.author.tag}`, msg.author.displayAvatarURL({ size: 32 }));

    return msg.channel.createMessage(embed.create) 




    }
}


module.exports = hug;
