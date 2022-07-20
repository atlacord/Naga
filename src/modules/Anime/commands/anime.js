const Kitsu = require('kitsu.js')
const kitsu = new Kitsu();
var aq = require('animequote')
const MessageEmbed = require("davie-eris-embed")

const { Command, CommandOptions, CommandPermissions, Message } = require('axoncore');
const atlatopics = require('../../../assets/atlatopics.json');
// const axios = require('axios');

class anime extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'anime';
        this.aliases = [ 'anime' ];

        this.hasSubcmd = false;

        this.info = {
            name: 'anime',
            description: 'Get info about an anime series!',
            usage: 'anime Food Wars',
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

    async execute( { msg, args } ) {
        
        var search = args.split(/\s+/g).slice(1).join(" ");
    if (!search) {
        kitsu.searchAnime(aq().quoteanime).then(result => {
            var anime = result[0]
            const embed = new MessageEmbed()
            .setAuthor(`${anime.titles.english} | ${anime.showType}`, anime.posterImage.original)
            .setThumbnail(anime.posterImage.original)
            .setColor('#ffc7e9')
            .setDescription(anime.synopsis.replace(/<[^>]*>/g, '').split('\n')[0])
            .addField('**Information**', `**Japanese Name:** ${anime.titles.romaji} \n **Age Rating:** ${anime.ageRating} \n **NSFW:** ${anime.nsfw ? 'Yes' : 'No'} `, true)
            .addField('**Stats:**', `**Average Rating:** ${anime.averageRating} \n **Rating Rank:** ${anime.ratingRank} \n **Popularity:** ${anime.popularityRank}` , true)
            .addField('**Status:**', `**Average Rating:** ${anime.averageRating} \n **Rating Rank:** ${anime.ratingRank} \n **Popularity:** ${anime.popularityRank}` , true)
            .setFooter("Requested by: " + msg.member.username, msg.author.avatarURL)
            
            msg.channel.createMessage(embed.create)


        })
    }
else {
    var search = args.split(/\s+/g).slice(1).join(" ");
    
    kitsu.searchAnime(search).then(result => {
        if (result.length === 0) {
            return msg.Channel.createMessage(`I looked everywhere, but couldn't find **${search}**!`)
        }
        var anime = result[0]
        const embed = new MessageEmbed()
            .setAuthor(`${anime.titles.english} | ${anime.showType}`, anime.posterImage.original)
            .setThumbnail(anime.posterImage.original)
            .setColor('#ffc7e9')
            .setDescription(anime.synopsis.replace(/<[^>]*>/g, '').split('\n')[0])
            .addField('**Information**', `**Japanese Name:** ${anime.titles.romaji} \n **Age Rating:** ${anime.ageRating} \n **NSFW:** ${anime.nsfw ? 'Yes' : 'No'} `, true)
            .addField('**Stats:**', `**Average Rating:** ${anime.averageRating} \n **Rating Rank:** ${anime.ratingRank} \n **Popularity:** ${anime.popularityRank}` , true)
            .addField('**Status:**', `**Average Rating:** ${anime.averageRating} \n **Rating Rank:** ${anime.ratingRank} \n **Popularity:** ${anime.popularityRank}` , true)
            
            .setFooter("Requested by: " + msg.member.username, msg.author.avatarURL)
            
            msg.channel.createMessage(embed.create) 
}
    )}





     
    


        // EOC
    }
}


module.exports = anime;
