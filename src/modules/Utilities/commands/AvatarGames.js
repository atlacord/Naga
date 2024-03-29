const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const AvatarStart = require('./AvatarGames/Start');
const AvatarEnd = require('./AvatarGames/End');

class AvatarGames extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'agames';
        this.aliases = [
            'ag',
            'avatargames'
        ];

        this.hasSubcmd = true;

        this.info = {
            name: 'agames',
            description: 'Starts/ends Avatar Games!',
            usage: 'agames',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 0,
            guildOnly: true,
        } );

        this.permissions = new CommandPermissions(this, {
            custom: (msg) => msg.member.roles.includes('830138455337730049') // Event Masters
        });
    };

    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

     init() {
        return [AvatarStart, AvatarEnd]
    }

    execute({ msg }) {
        try {
            this.sendMessage(msg.channel, `Run \`${this.axon.settings.prefixes}agames start\` or \`${this.axon.settings.prefixes}agames end\`!`);
        } catch (err) {
            console.log(err)
        }
    }
}

module.exports = AvatarGames;