const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const moment = require('moment');
const { ImgurClient } = require('imgur');
const { exec } = require('child_process');
const fs = require('fs');

// Probably should've put these in an env variable file but whatever
// const clientId = '52b527e0d60b7b0';
// const clientSecret = 'b433ad10a9334a0ac51f4953f3b8e46a53ff4880';
// const refreshToken = '41839a7d6ff2db6ef2caf6f4ae4005ce29302eac';

const MESSAGE_QUANTITY = 400000;


class ArchiveAll extends Command {

    /**
     * @param {import('axoncore').Module} module
     */

    constructor(module) {
        super(module);

        this.label = 'archiveall';
        this.aliases = [];

        this.hasSubcmd = false;

        this.info = {
            name: 'archiveall',
            description: 'Archives all channels from the Closed Channel & Events categories',
            usage: 'archiveall',
        };

        /**
         * @param {CommandOptions}

         */

        this.options = new CommandOptions(this, {
            argsMin: 0,
            guildOnly: true,
        } );

        this.permissions = new CommandPermissions(this, {
            staff: {
                needed: this.axon.staff.admins,
                bypass: this.axon.staff.owners,
            },
        } );
    }

    exec(command) {
		return new Promise((resolve, reject) => {
			exec(command, (err, stdout, stderr) => {
				if (err) return reject(err);
				return resolve(stdout || stderr);
			});
		});
    }

    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    async uploadImage(client, count, msg) {
        let imglink = await client.upload({
            image: msg.attachments[count].url,
            title: 'Naga archive upload',
            description: `Channel ID: ${msg.channel.id}, Message ID: ${msg.id}`
        })
        console.log(imglink.data.link);
        return imglink.data.link;
    }

    async execute ( { msg, args } ) {

        // const client = new ImgurClient({
        //     clientId: clientId,
        //     clientSecret: clientSecret,
        //     refreshToken: refreshToken,
        //   });

          let channel = null;

          let categories = [ 
            '562452488301838346', // Closed Channels
            '758001268051673139', // Closed Events 1
            '896411136407240704' // Closed Events 2 
        ];

          let dontArchive = [
            '431892824149983253', // gaming_and_tech
            '755185750970204311', // nerdatorium
            // '726479365441060904', // jasmine dragon 
            '372087508579778570' // dyno_action_log
        ];

          let channels = [];
          let channelNames = [];

          let c = await this.bot.guilds.get('370708369951948800').channels.filter(i => (categories.includes(i.parentID)) && (!dontArchive.includes(i.id)))
          c.forEach(i => channels.push(i.id));

          this.sendMessage(msg.channel, { 
            embed: {
                color: this.utils.getColor('green'),
                description: `Now archiving **${channels.length}** channels. Depending on ratelimits and channel size, this can take anywhere from 10 minutes to 4 hours.`
            }
          })
          for (let i = 0; i <= channels.length; i += 1) {
            console.log(channels[i])
            channel = await this.bot.getChannel(channels[i]);
            channelNames.push(channel.name);

            try {

                let lastMsg = channel.lastMessageID;

                this.sendSuccess(msg.channel, `Archiving ${channel.name} (\`${i + 1}/${channels.length}\`)`);
                console.info(`Now archiving ${channel.name}.`);

                let newChannel = this.bot.guilds.get('1045099308065763379').createChannel(channel.name, 0);
                let webhook = this.utils.getOrCreateWebhook(newChannel);

                await this.bot.getMessages(channel.id, { limit: MESSAGE_QUANTITY, before: lastMsg })
                .then(async messages => {
                    messages = messages.filter(Boolean).map(msg => {
                        let imgurLinks = [];
                        if (msg.attachments.length > 0) {
                            for (let i = 0; i <= msg.attachments.length - 1; i += 1) {
                                if (!((msg.attachments[i].url).slice(-3) === ('mov' || 'mp4'))) {
                                    imgurLinks.push(msg.attachments[i].url);
                                }
                            }
                        }
                        let embed = {
                            author: { name: `${this.utils.fullName(msg.author)}`, icon_url: msg.author.avatarURL },
                            color: this.utils.getColor('blue'),
                            fields: [
                                { name: 'Content', value: null, inline: false },
                                { name: 'Author', value: `${this.utils.fullName(msg.author)}\n(${msg.author.id})`, inline: false },
                                { name: 'Channel', value: `${channel.name}\n(${channel.id})`, inline: false },
                                { name: 'Jump Link', value: `[Click Here](${msg.jumpLink})`, inline: true },
                            ],
                            footer: { text: `Message ID: ${msg.id}` },
                            timestamp: moment(msg.createdAt).format('dddd, Do MMMM YYYY hh:mm:ss')
                        }
                        return [
                            `[${moment(msg.createdAt).format('dddd, Do MMMM YYYY hh:mm:ss')}]`,
                            `${msg.author.username}#${msg.author.discriminator} (${msg.author.id}):\nContent: ${msg.content}\nAttachments: ${imgurLinks.join(', ') || null}\nMessage ID: ${msg.id}\r\n\r\n`
                        ].join(' ');
                    }); 

                    // messages.push(`Messages Archived on ![](${channel.guild.dynamicIconURL('png', 32)}) **${channel.guild.name}** - **${channel.name} (${channel.id}** --\r\n\r\n`);
                    messages = messages.reverse().join('');
                    for (let i in messages) {
                        this.bot.executeWebhook(webhook.id, webhook.token, { 
                            embed: {}
                        })
                    }
                    console.log(messages);

                    const data = Buffer.from(messages, 'utf8');
                    fs.writeFile(`Archives/${channel.id}.md`, data, (err) => {
                        if (err !== null) { this.sendError(msg.channel, `An error occurred while creating the text file: ${err}`) };
                    });
                })
                this.sendSuccess(msg.channel, `Successfully archived ${channel.name} (\`${i + 1}/${channels.length}\`)`)
                console.info(`Finished archiving ${channel.name}.`)
            } catch (err) {
                this.utils.logError(msg, err, 'internal', 'Something went wrong.');
            }

            this.utils.delayFor(60000);
        }
        /*  let msgArray = [];
        msgArray = msgArray.concat(this.utils.splitMessage(channelNames.join('\n'), 1990));
		for (let m of msgArray) {
			this.sendMessage(msg.channel, m);
		} */
    }
}


module.exports = ArchiveAll; 
