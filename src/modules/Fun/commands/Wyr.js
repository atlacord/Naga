const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const questions = require('../../../assets/wyr.json');
const { readFileSync, writeFileSync } = require('fs');

const COMMAND_COOLDOWN = 600000;

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
            cooldown: null,
            guildOnly: true,
        } );

        this.permissions = new CommandPermissions(this, {
            custom: (msg) => msg.channel.parentID !== '372086709950611456',
        });
    }

    handleCooldown() {
        let data = readFileSync('src/assets/cooldown.json');
        let lastUsed = JSON.parse(data);

        const timeLeft = Date.now() - lastUsed;
        if (timeLeft <= COMMAND_COOLDOWN) {
            return Math.ceil((COMMAND_COOLDOWN - timeLeft) / 100) / 10; 
        } else return false;
    }
    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    async execute( { msg } ) {
        let timeRemaining = this.handleCooldown();
        if (timeRemaining !== false) {
            return this.sendError(msg.channel, `This command has already been used recently! Try again in **${timeRemaining} seconds**!`);
        }
        let messagetext =  questions[Math.floor(Math.random() * questions.length)]
        let question = messagetext.split("Would you rather ")[1]
        let Option1 = question.split(" or ")[0]
        let Option2 = question.split(" or ")[1]
        
        let embed = {
            title: 'Let\'s play Would You Rather!',
            color: this.utils.getColor('blue'),
            description: `Would you rather: \n 🅰️ ${Option1} \n or \n :regional_indicator_b: ${Option2}`
        }

        this.sendMessage(msg.channel, {embed}).then(msg => {
            msg.addReaction('🅰️');
            msg.addReaction('🇧');
        }).then(writeFileSync('src/assets/cooldown.json', JSON.stringify(msg.createdAt)));
    }
}


module.exports = Wyr;