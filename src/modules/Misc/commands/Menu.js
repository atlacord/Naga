const { Command, CommandOptions, CommandPermissions, Message } = require('axoncore');
const MessageEmbed = require("davie-eris-embed");
const { default: ImgurClient } = require('imgur');

class Menu extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'menu';
        this.aliases = [ '' ];

        this.hasSubcmd = false;

        this.info = {
            name: 'menu',
            description: 'Test for the menu & button interactions',
            usage: 'menu',
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

    async execute( { msg, args } ) {
        
        if(!args.length) {
            return msg.channel.createMessage({
                content: "This button is a test",
                components: [
                    {
                        type: 1, 
                        components: [
                        {
                            type: 2,
                            label: "Click me!", 
                            style: 1, 
                            custom_id: "button1"
                        }
                        ]
                    }
                ]
            })
        }

     else {
        return msg.channel.createMessage({
            content: "This button is a test",
            components: [
                {
                    type: 1, 
                    components: [
                    {
                        type: 2,
                        label: "Do u dare click me!", 
                        style: 2, 
                        custom_id: "button2"
                    }
                    ]
                }
            ]
        })
    }
       
     
    


        // EOC
    }
}


module.exports = Menu;

