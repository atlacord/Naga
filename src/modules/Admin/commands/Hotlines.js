const { Command, CommandOptions, CommandPermissions } = require('axoncore');

class Hotlines extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'hotlines';
        this.aliases = [];

        this.hasSubcmd = false;

        this.info = {
            name: 'hotlines',
            description: 'Sends the hotline embed to the resources channel',
            usage: 'hotlines',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 0,
            cooldown: 1000,
            guildOnly: true,
        } );

        this.permissions = new CommandPermissions(this, {
            staff: {
                needed: this.axon.staff.owner,
                bypass: this.axon.staff.owners,
            },
        } );
    }

    async execute({ msg }) {
        let embed = {
            title: 'Self-Care Resources',
            color: this.utils.getColor('pink'),
            description: 'If you or someone you know is going through a rough time, and just need someone to talk to, please click on the "Enter your country" button below. \n⚠ **If your country is not listed, please call your local emergency number.** ⚠ Don\'t make a permanent decision to a temporary problem.\n\nhttps://faq.whatsapp.com/general/security-and-privacy/global-suicide-hotline-resources\nhttps://www.reddit.com/r/SuicideWatch/wiki/hotlines\n\nTo leave this channel and re-gain access to the rest of the community, use the "Exit this channel" button below.'
        };

        await this.bot.getChannel('1105534600102543412').editMessage('1106798818667810906', {
            embed: embed,
            components: [
                {
                    type: 1, 
                    components: [
                        {
                            type: 2,
                            label: "Enter your country",
                            style: 1,
                            custom_id: 'hotline_inputcountry_button'
                        },
                        {
                            type: 2,
                            label: 'Exit this channel',
                            style: 2,
                            custom_id: 'hotline_exit_button'
                        }
                    ]
                }
            ]
        })
    }
}

module.exports = Hotlines;