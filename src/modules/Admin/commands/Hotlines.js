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

    async execute() {
        let embed = {
            title: 'Self-Care Resources',
            color: this.utils.getColor('pink'),
            description: ['Hi, welcome to the Self Care help channel.',

            `You've been added to this channel as there have been indications that you or someone you know is going through a rough time, and just need someone to talk to or some help regarding current circumstances.\n`
            
            `Whilst we'd love to be that place, since none of us are trained professionals we're unable to offer this. However, we've provided below some resources for you to utilise, and we highly encourage you do so! <:bolinhug:797831316623982635>\n`
            
            `Being in this channel is not a punishment - you're free to use the exit button at any time. However, we do humbly ask that any further discussion or support requests concerning this topic are directed through these resources.\n`
        
            `Please click on the "Enter your country" button below.\n⚠ If your country is not listed, please call your local emergency number.\n⚠ Don't make a permanent decision to a temporary problem.`].join('\n')
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
