const { Command, CommandOptions } = require('axoncore');
const axios = require('axios');
const moment = require('moment')
const MessageEmbed = require("davie-eris-embed")
const TwoColor = '9037972';
const fetch = require('node-fetch');



const malBadges = [
    { url: 'https://i.imgur.com/YGLefI9.png', max: 499, min: -1, title: 'unranked'},
    { url: 'https://i.imgur.com/DKHajgw.png', max: 999, min: 500, title: '500'},
    { url: 'https://i.imgur.com/dZ8bNQW.png', max: 4999, min: 1000, title: '1000'},
    { url: 'https://i.imgur.com/rabLZqh.png', max: 9999, min: 5000, title: '5000'},
    { url: 'https://i.imgur.com/01NgPDw.png', max: 14999, min: 10000, title: 'malkouhai'},
    { url: 'https://i.imgur.com/phrKQJI.png', max: 19999, min: 15000, title: 'malsenpai'},
    { url: 'https://i.imgur.com/MzmmlUG.png', max: 9999999, min: 20000, title: 'malsensei'},

]

function hyperlinkify(arr){
    if (!arr.length) return null
  
    let res = ''
    let lastindex = null
  
    for (let i = 0; res.length < 950 && lastindex === null; i++) {
      let toAdd = ` • [${arr[i].name}](${arr[i].url})`
  
      if (toAdd.length + res.length > 950) {
        lastindex = i
        return
      }
  
      return res += toAdd
    }
  
    return `${res}${lastindex && lastindex < arr.length - 1 ? ` and ${arr.length - lastindex - 1} more!`:`.`}`
  }
  
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
        const textTrunctuate = function(str, length, ending) {
            if (length == null) {
              length = 100;
            }
            if (ending == null) {
              ending = '...';
            }
            if (str.length > length) {
              return str.substring(0, length - ending.length) + ending;
            } else {
              return str;
            }
          };
      
          
          if (args.length === 0) {return msg.channel.createMessage('Please provide a profile for me to lookup!') };
      
          const fullProfile = await fetch(`https://api.jikan.moe/v4/users/${args[0]}`).then(res => res.json())
          const data = fullProfile.data
          const consumptionData = await fetch(`https://api.jikan.moe/v4/users/${args[0]}/statistics`).then(res => res.json())
          const favouritesData = await fetch(`https://api.jikan.moe/v4/users/${args[0]}/favorites`).then(res => res.json())

          const anime_stats = consumptionData.data.anime
          const manga_stats = consumptionData.data.manga
          const { anime, manga, characters, people } = favouritesData.data
          const total = anime_stats.episodes_watched + manga_stats.volumes_read
          const badge = malBadges.find( b => total > b.min && total < b.max).url
          const favanime = this.utils.hyperlinkify(anime)
          const favmanga = this.utils.hyperlinkify(manga)
          const favchar = this.utils.hyperlinkify(characters)
          const favpeople = this.utils.hyperlinkify(people)
      
          const embed = {
            "embed": {
              "author": {
                name: "MAL profile search | " + data.username,
                icon_url: badge,
                url: data.url,
              },
              "thumbnail": {
                "url": data.images.jpg.image_url,
              },
              "description": `${data.about ? textTrunctuate(data.about,350,`...[Read More](${data.url})\n\n`) : ``}• **Gender:** ${data.gender}\n• **From:** ${data.location}\n• **Joined MAL:** ${moment(data.joined).format("dddd, MMMM Do YYYY, h:mm:ss a")}*\n• **Last Seen:** ${moment(data.last_online).format("dddd, MMMM Do YYYY, h:mm:ss a")}*`,
              "color": 16610652,
              "fields": [
            
                {
                  "name": "Time binging Anime:",
                  "value": `\u200B\u2000\u2000• **Days watched**: ${anime_stats.days_watched}\n\u2000\u2000• **Mean Score**: ${anime_stats.mean_score}\n\u2000\u2000• **Watching**: ${anime_stats.watching}\n\u2000\u2000• **Completed**: ${anime_stats.completed}\n\u2000\u2000• **On Hold**: ${anime_stats.on_hold}\n\u2000\u2000• **Dropped**: ${anime_stats.dropped}\n\u2000\u2000• **Plan to Watch**: ${anime_stats.plan_to_watch}\n\u2000\u2000• **Rewatched**: ${anime_stats.rewatched}\n\u2000\u2000• **Total Entries:** ${anime_stats.total_entries}\n\u2000\u2000• **Episodes Watched**: ${anime_stats.episodes_watched}`,
                   inline: true,
                },
                {
                  "name": "Manga Statistics",
                  "value": `\u200B\u2000\u2000• **Days read**: ${manga_stats.days_read}\n\u2000\u2000• **Mean Score**: ${manga_stats.mean_score}\n\u2000\u2000• **Reading**: ${manga_stats.reading}\n\u2000\u2000• **Completed**: ${manga_stats.completed}\n\u2000\u2000• **On Hold**: ${manga_stats.on_hold}\n\u2000\u2000• **Dropped**: ${manga_stats.dropped}\n\u2000\u2000• **Plan to Read**: ${manga_stats.plan_to_read}\n\u2000\u2000• **Reread**: ${manga_stats.reread}\n\u2000\u2000• **Total Entries:** ${manga_stats.total_entries}\n\u2000\u2000• **Volumes read**: ${manga_stats.volumes_read}`,
                  inline: true
                },
                {
                  "name": "Fav anime",
                  "value": favanime ? favanime : 'Not Listed',
                 
                },
                {
                    "name": "Fav Manga",
                    "value": favmanga ? favmaga : 'Not Listed',
                   
                  },
                  {
                    "name": "Waifu/Husbando (Fav Character)",
                    "value": favchar ? favchar : 'Not Listed',
                   
                  },
                  {
                    "name": "Fav person/Staff",
                    "value": favpeople ? favpeople : 'Not Listed',
                    
                  },
               
              ]
              
      
      
      
            }
      
          }
          return msg.channel.createMessage(embed);
          
      
      
      
      
      
  /*      
        if(!args.length) {
            return this.sendError(msg.channel, `Please provide a profile for kme to lookup!`);
        }
    const embed = new MessageEmbed()
    const res = await axios.get(`https://api.jikan.moe/v4/users/${args[0]}/full`);
    const animedata = await axios.get(`https://api.jikan.moe/v4/users/${args[0]}/favorites`);
    const favorites = animedata.data.data || 'No favorites found!';
    const total = res.data.data.statistics.anime.episodes_watched + res.data.data.statistics.manga.volumes_read;
    const badge = malBadges.find( b => total > b.min && total < b.max).url;
    let favanime = favorites.anime[0]; if (favanime === undefined) { favanime = 'Not Listed'; } else favanime = favanime.title;
    let favmanga = favorites.manga[0]; if (favmanga === undefined) { favmanga = 'Not Listed'; } else favmanga = favmanga.title;
    let favchar = favorites.characters[0]; if (favchar === undefined) { favchar = 'Not Listed'; }else favchar = favchar.name;
    let favpeople = favorites.people[0]; if (favpeople === undefined) { favpeople = 'Not Listed' } else favpeople = favpeople.name;
    let aboutme = `${res.data.data.about ? this.utils.textTruncate(res.data.data.about,350,`...[Read More](${res.data.data.url})\n\n`) : ``}`
   if (aboutme.includes('<img class')) {
        var urlRegex = /src="([^"]+)/
        var input = aboutme 
        var aboutimage = input.match(urlRegex)[1];
       embed.setImage(aboutimage)
       aboutme = `Check the image for this users about me! (They use pictures instead of words :O)`
}
  
  
            embed.setAuthor("MAL profile search | " + res.data.data.username, badge, res.data.data.url)
            embed.setThumbnail(res.data.data.images.webp.image_url)
            embed.setDescription(aboutme + `\n • **Gender:** ${res.data.data.gender}\n• **From:** ${res.data.data.location}\n• **Joined MAL:** ${moment(res.data.data.joined).format("dddd, MMMM Do YYYY, h:mm:ss a")}*\n• **Last Seen:** ${moment(res.data.data.last_online).format("dddd, MMMM Do YYYY, h:mm:ss a")}*`)
            embed.setColor(this.utils.getColor('blue').toString(16))
            embed.addField("Time Binging Anime:", `\u200B\u2000\u2000• **Days watched**: ${res.data.data.statistics.anime.days_watched}\n\u2000\u2000• **Mean Score**: ${res.data.data.statistics.anime.mean_score}\n\u2000\u2000• **Watching**: ${res.data.data.statistics.anime.watching}\n\u2000\u2000• **Completed**: ${res.data.data.statistics.anime.completed}\n\u2000\u2000• **On Hold**: ${res.data.data.statistics.anime.on_hold}\n\u2000\u2000• **Dropped**: ${res.data.data.statistics.anime.dropped}\n\u2000\u2000• **Plan to Watch**: ${res.data.data.statistics.anime.plan_to_watch}\n\u2000\u2000• **Rewatched**: ${res.data.data.statistics.anime.rewatched}\n\u2000\u2000• **Total Entries:** ${res.data.data.statistics.anime.total_entries}\n\u2000\u2000• **Episodes Watched**: ${res.data.data.statistics.anime.episodes_watched}`, true)
            embed.addField("Manga Stats:" ,`\u200B\u2000\u2000• **Days read**: ${res.data.data.statistics.manga.days_read}\n\u2000\u2000• **Mean Score**: ${res.data.data.statistics.manga.mean_score}\n\u2000\u2000• **Reading**: ${res.data.data.statistics.manga.reading}\n\u2000\u2000• **Completed**: ${res.data.data.statistics.manga.completed}\n\u2000\u2000• **On Hold**: ${res.data.data.statistics.manga.on_hold}\n\u2000\u2000• **Dropped**: ${res.data.data.statistics.manga.dropped}\n\u2000\u2000• **Plan to Read**: ${res.data.data.statistics.manga.plan_to_read}\n\u2000\u2000• **Reread**: ${res.data.data.statistics.manga.reread}\n\u2000\u2000• **Total Entries:** ${res.data.data.statistics.manga.total_entries}\n\u2000\u2000• **Volumes read**: ${res.data.data.statistics.manga.volumes_read}` , true)
            embed.addField("Fav Anime:", favanime)
            embed.addField("Fav Manga", favmanga, true)
            embed.addField("Wafiu/Husbando (Fav Character)", favchar)
            embed.addField("Fav Staff", favpeople, true)
            

return msg.channel.createMessage(embed.create);
 */   

    }
}

module.exports = Mal;

