const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const moment = require('moment');
const { ImgurClient } = require('imgur');
const hastebin = require('hastebin')
const { exec } = require('child_process');
const fs = require('fs');

// Probably should've put these in an env variable file but whatever
const clientId = '52b527e0d60b7b0';
const clientSecret = 'b433ad10a9334a0ac51f4953f3b8e46a53ff4880';
const refreshToken = '41839a7d6ff2db6ef2caf6f4ae4005ce29302eac';

const MESSAGE_QUANTITY = 400000;


class Archive extends Command {

    /**
     * @param {import('axoncore').Module} module
     */

    constructor(module) {
        super(module);

        this.label = 'archive';
        this.aliases = [
            'savechat',
            'arc'
        ];

        this.hasSubcmd = false;

        this.info = {
            name: 'archive',
            description: 'Archives a channels messages into a document (work-in-progress)',
            usage: 'archive',
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
                needed: this.axon.staff.owners,
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

        const client = new ImgurClient({
            clientId: clientId,
            clientSecret: clientSecret,
            refreshToken: refreshToken,
          });

          let channel = null;

          let categories = [ '562452488301838346', '896411136407240704', '758001268051673139' ];
          let channels = [];
          let channelNames = [];

          if (!args || args[0] !== 'start') {
            this.sendMessage(msg.channel, {
                embed: {
                    color: this.utils.color.blue,
                    description: [`Welcome to the experimental Naga archive feature! This is still a work-in-progress.`,
                    `Currently, Naga is capable of archiving all text messages sent in the Closed Channels and Events categories (I will add support for individual channels beyond that once image archiving is finished.)\n`,
                    `This process will take roughly 2 hours, depending on ratelimits and the size of each channel. All files will be sent in the "Archives" directory, where they can then be shared however you wish.\n`,
                    `You may start the process by running \`n.archive start\`. Let me know if anything breaks!\n`,
                    `-soda`].join('\n')
                }
            })
          }

          else {
          let c = await this.bot.guilds.get('370708369951948800').channels.filter(i => categories.includes(i.parentID))
          c.forEach(i => channels.push(i.id));

          this.sendMessage(msg.channel, { 
            embed: {
                color: this.utils.color.blue,
                description: `Now archiving **${channels.length}** channels. Depending on ratelimits and channel size, this can take anywhere from 10 minutes to 4 hours.`
            }
          })
          for (let i = 0; i <= 112; i += 1) {
            channel = await this.bot.getChannel(channels[i]);
            channelNames.push(channel.name);

            try {
                // let channel = args[0].replace('<#','');
                // channel = channel.replace('>', '').toString();
                // const quantity = Math.round(MESSAGE_QUANTITY);

            // if (!quantity || quantity < 2) {
            //     return this.sendError(msg.channel, `Please provide the quantity of messages you want to archive!`);
            // }

            let lastMsg = channel.lastMessageID;

            this.sendSuccess(msg.channel, `Archiving ${channel.name} (\`${i}/${channels.length}\`)`);
            console.info(`Now archiving ${channel.name}.`)

            await this.bot.getMessages(channel.id, { limit: MESSAGE_QUANTITY, before: lastMsg })
            .then(async messages => {
                const count = messages.size; 
                const _id = Math.random().toString(36).slice(-7); 
                // let upch = '570053930193518594'
                // let senduploadchannel = await this.bot.getChannel(upch)

                messages = messages.filter(Boolean).map(msg => {
                    let link = null;
                    let imgurLinks = [];
                    if (msg.attachments.length > 0) {
                        for (let i = 0; i <= msg.attachments.length - 1; i += 1) {
                            // link = await this.uploadImage(client, i, msg);
                            imgurLinks.push(msg.attachments[i].url)
                        }
                    }
                    return [
                        `[${moment(msg.createdAt).format('dddd, do MMMM YYYY hh:mm:ss')}]`,
                        `${msg.author.username}#${msg.author.discriminator} (${msg.author.id}):\nContent: ${msg.content}\nAttachments: ${imgurLinks.join(', ') || null}\nMessage ID: ${msg.id}\r\n\r\n`
                    ].join(' ');
                }); 

                messages.push(`Messages Archived on ![](${channel.guild.dynamicIconURL('png', 32)}) **${channel.guild.name}** - **${channel.name} (${channel.id}** --\r\n\r\n`);
                messages = messages.reverse().join('');

                const data = Buffer.from(messages, 'utf8');
                fs.writeFile(`Archives/${channel.name}.txt`, data, (err) => {
                    // this.sendError(msg.channel, `An error occurred while creating the text file: ${err}`);
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
}

module.exports = Archive; 
