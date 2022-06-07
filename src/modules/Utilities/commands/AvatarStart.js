const { Command, CommandOptions } = require('axoncore');

class AvatarStart extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'start';
        this.aliases = [ 'start' ];

        this.hasSubcmd = false;

        this.info = {
            name: 'agames start',
            description: 'Unlocks the Avatar Games channel!',
            usage: 'agames start',
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

    async execute( { msg } ) {

        await this.bot.editChannelPermission('709827097559826553', '370708369951948800', 1024n, 0n, 0)
        this.sendMessage(msg.channel, 'Starting Avatar Games!');
    }
}


module.exports = AvatarStart;

