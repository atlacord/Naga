const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const korratopics = require('../../../assets/korratopics.json');
const server = require('../../../Models/Server');
const { readFileSync, writeFileSync } = require('fs');
// const axios = require('axios');

let ignoredTopics = require('../../../assets/IgnoredKorraTopics.json');

const COMMAND_COOLDOWN = 600000;

class Korra extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'lok';
        this.aliases = [ 'lok', 'korra', 'tlok' ];

        this.hasSubcmd = false;

        this.info = {
            name: 'topic lok',
            description: 'Provides a random topic about Legend of Korra!',
            usage: 'topic lok',
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
            channels: {
                bypass: ['372086844956868618', '721604232532459540', '1008421501487304844']
            }
        });
    }

    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    handleCooldown(timestamp) {
        const timeLeft = Date.now() - timestamp;
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

    async execute({ msg, executionType }) {
        server.findById(msg.guildID, (err, doc) => {

            // let atlatopics = await axios.get('http://atla.sh/topics.json');
            // atlatopics = atlatopics.data;
            if (executionType !== 2) {
                let timeRemaining = this.handleCooldown(doc.data.topicTimestamps.korra);
                if (timeRemaining !== false) {
                    return this.sendError(msg.channel, `This command has already been used recently!\nTry again in **${timeRemaining}**!`);
                }
            };

            let topic = Math.floor(Math.random() * korratopics.length);

            if (doc.data.ignoredKorraTopics.length === korratopics.length) {
                doc.data.ignoredKorraTopics = [];
            }

            while (doc.data.ignoredKorraTopics.includes(topic)) {
                topic = Math.floor(Math.random() * korratopics.length);
            }

            return this.sendMessage(msg.channel, {
                embed: {
                    color: this.utils.getColor('blue'),
                    description: korratopics[topic]
                }
            }).then(doc.data.ignoredKorraTopics.push(topic), doc.data.topicTimestamps.korra = msg.createdAt, doc.save());
        });
    }
}


module.exports = Korra;

