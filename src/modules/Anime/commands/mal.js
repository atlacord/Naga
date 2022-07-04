const { Command, CommandOptions } = require('axoncore');
const axios = require('axios');
const moment = require('moment')
const MessageEmbed = require("davie-eris-embed")

const malBadges = [
    { url: 'https://i.imgur.com/YGLefI9.png', max: 499, min: -1, title: 'unranked'},
    { url: 'https://i.imgur.com/DKHajgw.png', max: 999, min: 500, title: '500'},
    { url: 'https://i.imgur.com/dZ8bNQW.png', max: 4999, min: 1000, title: '1000'},
    { url: 'https://i.imgur.com/rabLZqh.png', max: 9999, min: 5000, title: '5000'},
    { url: 'https://i.imgur.com/01NgPDw.png', max: 14999, min: 10000, title: 'malkouhai'},
    { url: 'https://i.imgur.com/phrKQJI.png', max: 19999, min: 15000, title: 'malsenpai'},
    { url: 'https://i.imgur.com/MzmmlUG.png', max: 9999999, min: 20000, title: 'malsensei'},

]

class Mal extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'mal';
        this.aliases = [
            'myanimelist',
            'malprofile',
        ];

        this.hasSubcmd = false;

        this.info = {
            name: 'mal',
            description: 'Pull up someones myanimelist profile!',
            usage: 'mal <profilename>',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 0,
            cooldown: 5000,
            guildOnly: true,
        } );
    }
    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    async execute( { msg, args } ) {
        
        
        if(!args.length) {
            return this.sendError(msg.channel, `Please provide a profile for kme to lookup!`);
        }
    const embed = new MessageEmbed()
    const data = await axios.get(`https://api.jikan.moe/v4/users/${args[0]}/full`)
    const animedata = await axios.get(`https://api.jikan.moe/v4/users/${args[0]}/favorites`)
    const { anime_stats, manga_stats } = data
    const { anime, manga, characters, people } = animedata.favorites
    const total = anime_stats.episodes_watched + manga_stats.volumes_read
    const badge = malBadges.find( b => total > b.min && total < b.max).url
    const favanime = hyperlinkify(anime)
    const favmanga = hyperlinkify(manga)
    const favchar = hyperlinkify(characters)
    const favpeople = hyperlinkify(people)
    let aboutme = `${data.about ? textTruncate(data.about,350,`...[Read More](${data.url})\n\n`) : ``}`
   if (aboutme.includes('<img class')) {
        var urlRegex = /src="([^"]+)/
        var input = aboutme 
        var aboutimage = input.match(urlRegex)[1];
       embed.setImage(aboutimage)
       aboutme = `Check the image for this users about me! (They use pictures instead of words :O)`
}
  
  
            embed.setAuthor("MAL profile search | " + data.username, badge, data.url)
            embed.setThumbnail(data.image_url)
            embed.setDescription(aboutme + `\n • **Gender:** ${data.gender}\n• **From:** ${data.location}\n• **Joined MAL:** ${moment(data.joined).format("dddd, MMMM Do YYYY, h:mm:ss a")}*\n• **Last Seen:** ${moment(data.last_online).format("dddd, MMMM Do YYYY, h:mm:ss a")}*`)
            embed.setColor(colour.animeColour)
            embed.addField("Time Binging Anime:", `\u200B\u2000\u2000• **Days watched**: ${anime_stats.days_watched}\n\u2000\u2000• **Mean Score**: ${anime_stats.mean_score}\n\u2000\u2000• **Watching**: ${anime_stats.watching}\n\u2000\u2000• **Completed**: ${anime_stats.completed}\n\u2000\u2000• **On Hold**: ${anime_stats.on_hold}\n\u2000\u2000• **Dropped**: ${anime_stats.dropped}\n\u2000\u2000• **Plan to Watch**: ${anime_stats.plan_to_watch}\n\u2000\u2000• **Rewatched**: ${anime_stats.rewatched}\n\u2000\u2000• **Total Entries:** ${anime_stats.total_entries}\n\u2000\u2000• **Episodes Watched**: ${anime_stats.episodes_watched}`, true)
            embed.addField("Manga Stats:" ,`\u200B\u2000\u2000• **Days read**: ${manga_stats.days_read}\n\u2000\u2000• **Mean Score**: ${manga_stats.mean_score}\n\u2000\u2000• **Reading**: ${manga_stats.reading}\n\u2000\u2000• **Completed**: ${manga_stats.completed}\n\u2000\u2000• **On Hold**: ${manga_stats.on_hold}\n\u2000\u2000• **Dropped**: ${manga_stats.dropped}\n\u2000\u2000• **Plan to Read**: ${manga_stats.plan_to_read}\n\u2000\u2000• **Reread**: ${manga_stats.reread}\n\u2000\u2000• **Total Entries:** ${manga_stats.total_entries}\n\u2000\u2000• **Volumes read**: ${manga_stats.volumes_read}` , true)
            embed.addField("Fav Anime:", favanime ? favanime : 'Not Listed')
            embed.addField("Fav Manga", favmanga ? favmanga : 'Not Listed', true)
            embed.addField("Wafiu/Husbando (Fav Character)", favchar ? favchar : 'Not listed')
            embed.addField("Fav Staff", favpeople ? favpeople : "Not Listed", true)
            

return msg.channel.send(embed.create);
    











    }
}

module.exports = Mal;

