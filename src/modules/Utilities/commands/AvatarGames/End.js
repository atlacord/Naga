const { Command, CommandOptions, CommandPermissions } = require('axoncore');

class End extends Command {
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
        });

        this.permissions = new CommandPermissions(this, {
            custom: (msg) => {
                return msg.member.roles.includes('830138455337730049') || // Event Master
                msg.member.roles.includes('871374249808527380') || // + role
                msg.member.roles.includes('1182448979288527029') // Sentry
            }
        });
    }
    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    async execute({ msg }) {
            await this.bot.editChannelPermission('709827097559826553', '370708369951948800', 0n, 1024n, 0)
            this.sendSuccess(msg.channel, 'Ending Avatar Games.');
    }
}


module.exports = End;

