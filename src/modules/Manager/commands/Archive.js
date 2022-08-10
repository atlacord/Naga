const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const moment = require('moment');
const { ImgurClient } = require('imgur');
const hastebin = require('hastebin')
const { exec } = require('child_process');
const fs = require('fs');

const ArchiveAll = require('./ArchiveAll');

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

        const client = new ImgurClient({
            clientId: clientId,
            clientSecret: clientSecret,
            refreshToken: refreshToken,
        });

        let channel = args[0].replace('<#','');
        channel = channel.replace('>', '').toString();
        channel = this.bot.getChannel(channel);
        const quantity = Math.round(MESSAGE_QUANTITY);

        try {
            if (!quantity || quantity < 2) {
                return this.sendError(msg.channel, `Please provide the quantity of messages you want to archive!`);
            }

            let lastMsg = channel.lastMessageID;

            this.sendSuccess(msg.channel, `Archiving ${channel.name}`);
            console.info(`Now archiving ${channel.name}.`)

            await this.bot.getMessages(channel.id, { limit: 1000, before: lastMsg })
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

                messages.push(`Messages Archived on ![](${channel.guild.dynamicIconURL('png', 32)}) **${channel.guild.name}** - **${channel.name} (${channel.id})** --\r\n\r\n`);
                messages = messages.reverse().join('');

                const data = Buffer.from(messages, 'utf8');
                fs.writeFile(`Archives/${channel.name}.md`, data, (err) => {
                    // this.sendError(msg.channel, `An error occurred while creating the text file: ${err}`);
                });
            })
                this.sendSuccess(msg.channel, `Successfully archived ${channel.name} (\`${i + 1}/${channels.length}\`)`)
                console.info(`Finished archiving ${channel.name}.`)
        } catch (err) {
            this.utils.logError(msg, err, 'internal', 'Something went wrong.');
        }
    }
}


module.exports = Archive; 
