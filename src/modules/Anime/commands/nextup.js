const { Command, CommandOptions, CommandPermissions, Message } = require('axoncore');
const MessageEmbed = require("davie-eris-embed")
require('moment-duration-format')
const { NextAirDate_Query: withQuery , NextAirDate_NoQuery: withoutQuery } = require('../../../../Util/gqlHelper');
const moment  = require('moment');
const AniColour = '9037972'




class nextup extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'nextup';
        this.aliases = [ 'nextair', 'nextep', 'nextepisode' ];

        this.hasSubcmd = false;

        this.info = {
            name: 'nextup',
            description: 'Get info about the next episode of an anime series!',
            usage: 'nextep Chainsaw Man',
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
        
        const query = args.join(' ')
   

        const res = await this.utils.AniListQuery(
            query
            ? withQuery
            : withoutQuery
          , query
            ? {
                  search: query
                , status: 'RELEASING'
              }
            : {}
          )
    
    
        if (
          res.errors
          && res.errors.some(
            ({ message }) => message !== 'Not Found.'
          )
        ) return msg.channel.createMessage('<:no:389333455726444554> | Bork! '
        + msg.author.username
        + 'An unexpected error has occured!\n\n'
        + '\`\`\`xl\n'
        + res.errors.map(
            ({ message }) => '• ' + message
          ).join('\n')
        + '\`\`\`'
      )
    
      if (
        res.errors
        && res.errors.some(
          ({ message }) => message === 'Not Found.'
        )
      ) return msg.channel.createMessage(
          '<:no:389333455726444554> | '
        + msg.author.username
        + ', That anime may have already **Finished Airing**, have **unknown next Airdate**, '
        + 'or that anime may have **never existed** at all'
      )
      const [ now, next, later ] = query
      ? [ res.data.Media ]
      : res.data.Page.media.filter(
        ({ nextAiringEpisode }) => nextAiringEpisode
      ).sort(
        (A, B) => A.nextAiringEpisode.timeUntilAiring - B.nextAiringEpisode.timeUntilAiring
      ).slice(0,3)
    
    
    
    if (query) {
      return msg.channel.createMessage({
        embed: {
    color: AniColour,
    "title":  now.title.english
    ? now.title.english
    : now.title.romaji
      ? now.title.romaji
      : now.title.native,
    "url": now.siteUrl,
    "thumbnail": {
      url: now.coverImage.large 
      },
    "description": `*${
        now.title.native
      }*\n*${
        now.title.romaji
      }*\n\n${
        now.nextAiringEpisode.timeUntilAiring
        ? `Episode **${
          now.episodes === now.nextAiringEpisode.episode
          ? `${now.nextAiringEpisode.episode} (Final Episode)`
          : now.nextAiringEpisode.episode
        }** of [${
          now.title.english
          ? now.title.english
          : now.title.romaji
            ? now.title.romaji
            : now.title.native
        }](${
          now.siteUrl
        }) will air in approximately **${
          moment(now.nextAiringEpisode.timeUntilAiring).format('D [days] H [hours] m [minutes]')
        }**`
        : `Next episode airdate for [${
          now.title.english
          ? now.title.english
          : now.title.romaji
            ? now.title.romaji
            : now.title.native
        }](${
          now.siteUrl
        }) is currently unknown`
      }`,
    
    footer: {
    "timestamp": new Date,
    "icon_url": msg.author.avatarURL,
    "text": "Requested by " + msg.author.username
    }} 
    })
    // End of no query 
    } else {
        return msg.channel.createMessage({
            embed: { 
                "color": AniColour, 
                "thumbnail": {
                 url: now.coverImage.large, 
                },
                "author": {
                    name: `Airing First: ${
                        now.title.english
                        ? now.title.english
                        : now.title.romaji
                          ? now.title.romaji
                          : now.title.native
                      }`,
                    icon_url: now.coverImage.large, 
                    url: now.siteUrl
                },
                "description": `[${
                    now.title.english
                    ? now.title.english + ' • '
                    : ''
                  }${
                    now.title.romaji
                    ? now.title.romaji + ' • '
                    : ''
                  }${
                    now.title.native
                    ? now.title.native + ' • '
                    : ''
                  }](${
                    now.siteUrl
                  }) ${
                    now.nextAiringEpisode.timeUntilAiring
                    ? `\nEpisode **${
                      now.nextAiringEpisode.episode === now.episodes
                      ? `${now.nextAiringEpisode.episode} (Final Episode)`
                      : `${now.nextAiringEpisode.episode}`
                    }** airs in **${
                      moment(now.nextAiringEpisode.timeUntilAiring).format('D [days] H [hours] m [minutes]')
                    }**`
                    : 'Next Episode is currently **Unknown**'
                  }`,
    
                  fields: [
                      {
                          name: "**Airs Next**", 
                          value: `${
                            next
                            ? `**[${
                              next.title.english
                              ? next.title.english
                              : next.title.romaji
                                ? next.title.romaji
                                : next.title.native
                            }](${
                              next.siteUrl
                            })** ${
                              next.nextAiringEpisode.timeUntilAiring
                              ? `\nEpisode **${
                                next.nextAiringEpisode.episode === next.episodes
                                ? `${next.nextAiringEpisode.episode} (Final Episode)`
                                : `${next.nextAiringEpisode.episode}`
                              }** airs in **${
                                moment(next.nextAiringEpisode.timeUntilAiring).format('D [days] H [hours] m [minutes]')
                                }**`
                              : 'Next Episode is currently Unknown'
                            }`
                            : 'No Anime was found in the next 7 days'
                          }`
                      }, 
                      {
                          name: "Airs later:", 
                          value: `${
                            later
                            ? `**[${
                              later.title.english
                              ? later.title.english
                              : later.title.romaji
                                ? later.title.romaji
                                : later.title.native
                            }](${
                              later.siteUrl
                            })** ${
                              later.nextAiringEpisode.timeUntilAiring
                              ? `\nEpisode **${
                                later.nextAiringEpisode.episode === later.episodes
                                ? `${later.nextAiringEpisode.episode} (Final Episode)`
                                : `${later.nextAiringEpisode.episode}`
                              }** airs in **${
                                moment(later.nextAiringEpisode.timeUntilAiring).format('D [days] H [hours] m [minutes]')
                              }**`
                              : 'Next Episode is currently Unknown'
                            }`
                            : 'No Anime was found in the next 7 days'
                          }`
                      }
                  ],
                  footer: {
                    timestamp: new Date,
                    icon_url: msg.author.avatarURL,
                    text: "Requested by " + msg.author.username
                    }
    
    
    
            }})
    }
    
    
    
    
    
    
        // Command End

     
    


        // EOC
    }
}


module.exports = nextup;
