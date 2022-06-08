const { Command, CommandOptions } = require('axoncore');

class AvatarEnd extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'end';
        this.aliases = [ 'end' ];

        this.hasSubcmd = false;

        this.info = {
            name: 'agames end',
            description: 'Locks the Avatar Games channel!',
            usage: 'agames end',
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

        await this.bot.editChannelPermission('709827097559826553', '370708369951948800', 0n, 1024n, 0)
        this.sendMessage(msg.channel, 'Ending Avatar Games!');
    }
}


module.exports = AvatarEnd;

