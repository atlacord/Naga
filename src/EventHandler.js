const eris = require('eris');
const config = require('../configs/config.json');
const secret = require('../configs/secret.json');
const messages = require('../src/assets/joinmessages.json');

const server = '546800805060280352';


class EventHandler {
    constructor() {
        const client = new eris.Client(
            secret.bot.token,
            {
                autoreconnect: true,
                allowedMentions: {
                    everyone: false,
                    roles: false,
                    users: true
                },
                getAllUsers: true,
                messageLimit: 100,
                restMode: true,
                intents: [ 
                    'guilds',  
                    'guildBans', 
                    'guildEmojis', 
                    'guildIntegrations',
                    'guildWebhooks',
                    'guildInvites',
                    'guildVoiceStates',
                    'guildMessages',
                    'guildMessageReactions',
                    'guildMessageTyping',
                    'directMessages',
                    'directMessageReactions',
                    'directMessageTyping',
                    'guildPresences',
                    'guildMembers'
                ]
            },
        )

        try {
            connect();
            client.on('messageCreate', ((msg) => fakeBan(msg)));
            client.on('guildMemberAdd', ((guild, member) => handleJoin(guild, member)));
        } catch (err) {
            console.error(err)
        }

        async function connect() {
            await client.connect();
            console.info('Event handler online');
        }

        /**
         * Handles join messages
         * @param {eris.Guild} guild - The guild
         * @param {eris.Member} member - The member
         * @returns
        */
        async function handleJoin(guild, member) {
            if (guild.id !== '370708369951948800') return;
            else if (config.settings.joinLogs === true) {
                try {
                    let joinmsg = Math.floor(Math.random() * messages.length);
                    let msg = messages[joinmsg]
                    msg = msg.replace(/['"]+/g, "'")
                    msg = msg.replace(/{\w[{USER}]+/g, `${member.mention}`);
                    client.getChannel('761932923217379338').createMessage(msg)
                } catch (err) {
                console.error(err)
                }
            }
        }

        /**
         * Handles the fake ban command
         * @param {eris.Message} msg - The message
        */
        function fakeBan(msg) {
            if ((msg.content.startsWith('-ban')) && (!msg.author.bot)) {
                try {
                    msg.channel.createMessage(`Ban hammer dropped on ${msg.content.slice(5)}`);
                } catch (err) {
                    console.error(err);
                }
            }
        }
    }
}

module.exports = EventHandler;