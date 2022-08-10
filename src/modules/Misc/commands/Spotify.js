const { Command, CommandOptions } = require('axoncore');

class Spotify extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'spotify';

        this.aliases = [
            'nowplaying'
        ];

        this.hasSubcmd = false;

        this.info = {
            name: 'spotify',
            description: 'View what a user is listening to on Spotify',
            usage: 'spotify [optional user]',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 0,
            cooldown: 5000,
            guildOnly: false,
        } );
    }
    /**
     * @param {import('axoncore').CommandEnvironment} env
     */ 

    execute( { msg, args } ) {

    var user = msg.channel.guild.members.get(args[0]) || msg.member;
    var arr = JSON.stringify(user.activities);
    var obj = JSON.parse(arr);

        for (let i = 0; i < 5; i += 1) {
            let spotify = obj[i]

            // if (spotify.type !== '2' && spotify.name !== 'Spotify') {
            //     this.sendError(msg.channel, `You are not listening to Spotify.`);
            // }
        try {
            if(spotify.name === 'Spotify') {
            if (!spotify.assets.large_image) {
            } else { 
                var thumburl = `https://i.scdn.co/image/${ spotify.assets.large_image.slice(8)}`
            }           
                const embed = {
                    author: { 
                        name: 'Spotify', 
                        icon_url: 'https://cdn.discordapp.com/emojis/663452041992994846.png?v=1' 
                    },
                    thumbnail: { url: thumburl },
                    color: this.utils.getColor('spotify'),        
                    fields: [
                        { name: '**Title**', value: `[${spotify.details}](https://open.spotify.com/track/${spotify.sync_id})`, inline: false },
                        { name: '**Artist**', value: spotify.state, inline: false },
                        { name: '**Album**', value: spotify.assets.large_text, inline: false },
                    ],
                    footer: {
                        text: `${user.username}#${user.discriminator}`,
                        icon_url: user.avatarURL
                    }
                }
                msg.channel.createMessage({embed: embed})
            }
        } catch (err) {
            this.utils.logError(msg, err, 'internal', 'Something went wrong.');
        }
    }
}
}

module.exports = Spotify;