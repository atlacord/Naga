const Chariot = require('chariot.js');
const colour = require('../../Util/colorconfig.json')
const Kitsu = require('kitsu.js');
const kitsu = new Kitsu();
var aq = require('animequote');



class Anime extends Chariot.Command {
    constructor() {
        super();

        this.name = 'anime';
        this.cooldown = 5;
        this.allowDMs = false;
        this.help = {
            message: 'Goes and finds an anime for ya!',
            usage: 'anime animename',
            example: ['anime Darling in the Franxx'],
            inline: true
        }   
    }

  
    async execute(message, args, chariot) {
// Command Goes here!
    var search = message.content.split(/\s+/g).slice(1).join(" ");
    if (!search) {
        kitsu.searchAnime(aq().quoteanime).then(result => {
            var anime = result[0]
            message.channel.createEmbed(new Chariot.RichEmbed()
            .setAuthor(`${anime.titles.english} | ${anime.showType}`, anime.posterImage.original)
            .setThumbnail(anime.posterImage.original)
            .setColor(colour.animeColour)
            .setDescription(anime.synopsis.replace(/<[^>]*>/g, '').split('\n')[0])
            .addField('**Information**', `**Japanese Name:** ${anime.titles.romaji} \n **Age Rating:** ${anime.ageRating} \n **NSFW:** ${anime.nsfw ? 'Yes' : 'No'} `, true)
            .addField('**Stats:**', `**Average Rating:** ${anime.averageRating} \n **Rating Rank:** ${anime.ratingRank} \n **Popularity:** ${anime.popularityRank}` , true)
            .addField('**Status:**', `**Average Rating:** ${anime.averageRating} \n **Rating Rank:** ${anime.ratingRank} \n **Popularity:** ${anime.popularityRank}` , true)
            
            .setFooter("Requested by: " + message.member.username, message.author.avatarURL)
            )
        })
    }
else {
    var search = message.content.split(/\s+/g).slice(1).join(" ");
    
    kitsu.searchAnime(search).then(result => {
        if (result.length === 0) {
            return message.Channel.createMessage(`I looked everywhere, but couldn't find **${search}**!`)
        }
        var anime = result[0]
        message.channel.createEmbed(new Chariot.RichEmbed()
            .setAuthor(`${anime.titles.english} | ${anime.showType}`, anime.posterImage.original)
            .setThumbnail(anime.posterImage.original)
            .setColor(colour.animeColour)
            .setDescription(anime.synopsis.replace(/<[^>]*>/g, '').split('\n')[0])
            .addField('**Information**', `**Japanese Name:** ${anime.titles.romaji} \n **Age Rating:** ${anime.ageRating} \n **NSFW:** ${anime.nsfw ? 'Yes' : 'No'} `, true)
            .addField('**Stats:**', `**Average Rating:** ${anime.averageRating} \n **Rating Rank:** ${anime.ratingRank} \n **Popularity:** ${anime.popularityRank}` , true)
            .addField('**Status:**', `**Average Rating:** ${anime.averageRating} \n **Rating Rank:** ${anime.ratingRank} \n **Popularity:** ${anime.popularityRank}` , true)
            
            .setFooter("Requested by: " + message.member.username, message.author.avatarURL)
            )
}
    )}







// Command Finishes here!
}
}

module.exports = new Anime();