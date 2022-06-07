const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const AvatarStart = require('./AvatarStart');
const AvatarEnd = require('./AvatarEnd');

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
            staff: {
                needed: this.axon.staff.sentries,
                bypass: this.axon.staff.owners,
            },
        } );
    }

    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

     init() {
        return [AvatarStart, AvatarEnd]
    }

    execute( { msg } ) {
        try {
            this.sendMessage(msg.channel, `Run \`${this.axon.settings.prefixes}agames start\` or \`${this.axon.settings.prefixes}agames end\`!`);
        } catch (err) {
            console.log(err)
        }
    }
}

module.exports = AvatarGames;