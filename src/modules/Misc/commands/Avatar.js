const { Command, CommandOptions, Module } = require('axoncore');

class Avatar extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'avatar';
        this.aliases = [
            'av'
        ];

        this.hasSubcmd = false;

        this.info = {
            name: 'avatar',
            description: 'View a user\'s avatar',
            usage: 'avatar [user]',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 0,
            guildOnly: false,
        } );
    }
    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    execute( { msg, args } ) {

        const user = msg.mentions[0] || msg.channel.guild.members.get(args[0]) || msg.author;
        let roles = msg.member.roles.map(r => msg.channel.guild.roles.get(r)).filter(r => r.color);
            roles.sort((a,b) => b.position - a.position);
            let roleColor = 16777215n
            if (msg.member.roles.length > 0) {
                roleColor = roles[0].color
            }

            if (user !== msg.author) roleColor = this.utils.getColor('blue');

        try {
            this.sendMessage(msg.channel, {
                embed: {
                //    author: {
                    //    name: 'Avatar',
                    //    icon_url: user.avatarURL
                //    },
                    title: 'Avatar',
                    color: roleColor,
                    description: this.utils.fullName(user),
                    image: { 
                        url: user.avatarURL 
                    },
                    footer: {
                        text: `ID: ${user.id}`
                    },
                    timestamp: new Date()
                }
            })
        } catch (err) {
            this.utils.logError(msg, err, 'internal', 'Something went wrong.');
        }
    }
}

module.exports = Avatar;

