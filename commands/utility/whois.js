const Chariot = require('chariot.js');
const colour = require('../../Util/colorconfig.json')
const moment = require('moment');
const { resourceLimits } = require('worker_threads');

class Whois extends Chariot.Command {
    constructor() {
        super();

        this.name = 'whois';
        this.cooldown = 5;
        this.allowDMs = false;
        this.aliases = ['w', 'whoami', 'whothefuckis']
        this.help = {
            message: 'Get some info on a user!',
            usage: 'whois user',
            example: ['whois 123261299864895489'],
            inline: true
        }
    }

  
    async execute(message, args, chariot) {
// Command Goes here!
    let user = message.mentions[0] || chariot.users.get(args[0]);
    if(!user) { 
        user = message.author; 
        var description = `Wat, you forget who u r or somethin?`
    }
    let member = message.channel.guild.members.get(user.id)
    const roles = message.channel.guild.roles
    var description = `I did some quick snooping on the user you mentioned, ${user.mention}! Here's what I could find!`

    let result; 
    if(args[0] == undefined) {
        result = message.member
        var description = `Wat, you forget who u r or somethin?`
    }
    else {
        result = resolveMember(args[0], message.channel.members)
    }

    let userRoles; 
    let sortedRoles; 
    let formattedUserRoles; 
    if(result.roles.length) {
        userRoles = result.roles.map(g => message.channel.guild.roles.get(g));


        if(userRoles.length === 1) { 
            var EmbedColor = userRoles[0].color
        }
        else { 
            if(result.roles.length === 0) { 
                var Embedcolor = colour.coreColour
            }
            sortedRoles = userRoles.sort((a,b) => b.position - a.position); 
            formattedUserRoles = sortedRoles.map(r => `<@&${r.id}>`).join(", "); 
            var EmbedColor = sortedRoles[0].color || sortedRoles[1].color || sortedRoles[2].color || colour.coreColour
        }
    }

    const embed = new Chariot.RichEmbed()
            .setColor(EmbedColor)
            .setTitle(`${user.username}#${user.discriminator}`)
            .setDescription(description)
            .setThumbnail(user.avatarURL)
            .addField("**Their digits:**", user.id, true)
            .addField("**They go by:**", member ? (member.nick ? member.nick : "None") : "N/A", true)
            .addField("**They a Bot?**", user.bot ? "Yes" : "No", true)
            .addField("**Discordin' since:**", `${moment(user.createdAt).format("dddd, MMMM Do YYYY, h:mm:ss a")}`, true)
            .addField("**Vibin' with y'all since:**", `${moment(member.joinedAt).format("dddd, MMMM Do YYYY, h:mm:ss a")}`, true)
            .addField("**They up to:**", member ? (user.game ? user.game.name : "Nothing") : "Unknown")
            .addField("**ID Badge:**", formattedUserRoles && sortedRoles && userRoles ? formattedUserRoles : "Their badge is blank! No roles!")
            .setFooter("Requested by " + message.author.username, message.author.avatarURL)

    if (user.bannerURL) {
        embed.setImage(user.bannerURL)
    }

    return message.channel.createEmbed(embed)

        



    }
}

module.exports = new Whois();