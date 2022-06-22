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
            disableEveryone: true,
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
        // client.on('guildMemberUpdate', (guild, member, oldMember) => handleRole(guild, member, oldMember));
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
                msg = msg.replace(/['"]+/g, '`')
                msg = msg.replace(/[{'{USER}]+/g, `${member.mention}`);
                client.getChannel('761932923217379338').createMessage(msg)
            } catch (err) {
            console.error(err)
            }
        }
    }

    async function handleRole(guild, member, oldMember) { // eslint-disable-line
        // if (guild.id !== '370708369951948800') return;
        // else {
            console.log(oldMember.id);
            if ((!oldMember.roles.find(r => r.name === 'Team Avatar')) && (member.roles.find(r => r.name === 'Team Avatar'))) {
            return client.getChannel('826851222459514923').createMessage(`**A new member joins the fold! A big thanks to ${member.mention} for boosting the server! Please make sure you read the pins for info on how to get the TA colour role and more!**`)
            }
            if ((oldMember.roles.find(r => r.name === 'Team Avatar')) && (oldMember.roles.find(r => r.name === 'TA Colour')) && (!member.roles.find(r => r.name === 'Team Avatar'))) {
                const colourrole = client.guilds.get(server).roles.find(r => r.name === 'TA Colour')
                console.log(server.guild);
                client.guilds.get(server).removeMemberRole(member.id, colourrole.id, "User no longer boosting")
                return client.getChannel('826851222459514923').createMessage(`**A member of TA has left us, thanks to ${member.mention} for their contributions!**`)
            }
    // }
        }
    }
}

module.exports = EventHandler;