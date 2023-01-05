const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const { readFileSync, writeFileSync } = require('fs');
// const axios = require('axios');
const topics = require('../../../assets/topics.json');

const ATLA = require('./ATLA');
const Korra = require('./Korra');

const COMMAND_COOLDOWN = 600000;

class Topic extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'topic';
        this.aliases = [
        ];

        this.hasSubcmd = true;

        this.info = {
            name: 'topic',
            description: 'Provides a random topic',
            usage: 'topic',
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
            custom: (msg) => (msg.channel.parentID !== '372086709950611456' || '765832566875095040' || '765832566875095040'),
        });
    }
    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    init() {
        return [ATLA, Korra]
    }

    handleCooldown() {
        let data = readFileSync('src/assets/cooldown.json');
        let lastUsed = JSON.parse(data);

        const timeLeft = Date.now() - lastUsed;
        if (timeLeft <= COMMAND_COOLDOWN) {
            let time = Math.ceil((600000 - timeLeft) / 100) / 10
            let minutes = Math.floor(time / 60);
            let seconds = Math.ceil(time - minutes * 60);
            if (minutes === 0) {
                return `${seconds} sec`;
            } else {
                return `${minutes} minutes ${seconds} seconds`;
            }
        } else return false;
    }

    async execute({ msg }) {

        // let topics = await axios.get('http://atla.sh/topics.json');
        // topics = topics.data;

        let timeRemaining = this.handleCooldown();
        if (timeRemaining !== false) {
            return this.sendError(msg.channel, `This command has already been used recently!\nTry again in **${timeRemaining}**!`);
        }
        const topic = Math.floor(Math.random() * topics.length);
        
        return this.sendMessage(msg.channel, {
            embed: {
                color: this.utils.getColor('blue'),
                description: topics[topic],
            }
        }).then(writeFileSync('src/assets/cooldown.json', JSON.stringify(msg.createdAt)));
    }
}


module.exports = Topic;

