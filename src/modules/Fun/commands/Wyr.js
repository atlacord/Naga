const { Command, CommandOptions } = require('axoncore');
const questions = require('../../../Assets/wyr.json');

class Wyr extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'wyr';
        this.aliases = [
        ];

        this.hasSubcmd = false;

        this.info = {
            name: 'wyr',
            description: 'Gives a would your rather question!',
            usage: 'wyr',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 0,
            cooldown: 5000,
            guildOnly: false,
        } );
    }
    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    async execute( { msg } ) {
        let messagetext =  questions[Math.floor(Math.random() * questions.length)]
        let question = messagetext.split("Would you rather ")[1]
        let Option1 = question.split(" or ")[0]
        let Option2 = question.split(" or ")[1]
        
        let embed = {
            title: 'Let\'s play Would You Rather!',
            color: this.utils.color.blue,
            description: `Would you rather: \n 🅰️ ${Option1} \n or \n :regional_indicator_b: ${Option2}`
        }

        this.sendMessage(msg.channel, {embed}).then(msg => {
            msg.addReaction('🅰️');
            msg.addReaction('🇧');
        })
    }
}


module.exports = Wyr;