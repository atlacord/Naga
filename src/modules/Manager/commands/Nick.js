const { Command, CommandOptions, CommandPermissions } = require('axoncore');

class Nick extends Command {

    /**
     * @param {import('axoncore').Module} module
     */
    
    constructor(module) {
        super(module);

        this.label = 'nick';
        this.aliases = [
            'nickname',
            'botnick'
        ];

        this.hasSubcmd = false;

        this.info = {
            name: 'nick',
            description: 'Change Naga\'s nickname',
            usage: 'nick [new nick]',
        };

        /**
         * @param {CommandOptions}
         */

        this.options = new CommandOptions(this, {
            argsMin: 0,
            guildOnly: false,
        } );

        this.permissions = new CommandPermissions(this, {
            staff: {
                needed: this.axon.staff.admins,
                bypass: this.axon.staff.owners,
            },
        } );
    }

    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    execute ( { msg, args } ) {

        if (args[0].length > 32) {
            this.sendError(msg.channel, `Nicknames must be shorter than 32 characters`
        )}

        try {
            msg.channel.guild.editNickname(args[0])

        } catch (err) {
            this.logger.error(err);
			return this.sendError(msg.channel, `Something went wrong.`,
        )}
    }
}

module.exports = Nick;