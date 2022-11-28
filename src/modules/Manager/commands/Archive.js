const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const moment = require('moment');
const { ImgurClient } = require('imgur');
const hastebin = require('hastebin')
const { exec } = require('child_process');
const fs = require('fs');

// const ArchiveAll = require('./ArchiveAll');
// const ArchiveImages = require('./ArchiveImages');

// Probably should've put these in an env variable file but whatever
// const clientId = '52b527e0d60b7b0';
// const clientSecret = 'b433ad10a9334a0ac51f4953f3b8e46a53ff4880';
// const refreshToken = '41839a7d6ff2db6ef2caf6f4ae4005ce29302eac';

const MESSAGE_QUANTITY = Infinity;


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
            argsMin: 1,
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

    async execute ({ msg, args }) {

        // const client = new ImgurClient({
        //     clientId: clientId,
        //     clientSecret: clientSecret,
        //     refreshToken: refreshToken,
        // });

        let channel = args[0].replace('<#','');
        channel = channel.replace('>', '').toString();
        channel = this.bot.getChannel(channel);
        const quantity = Math.round(args[1] || MESSAGE_QUANTITY);

        try {

            let lastMsg = channel.lastMessageID;

            this.sendSuccess(msg.channel, `Archiving ${channel.name}. Quantity: ${quantity}`);
            console.info(`Now archiving ${channel.name}. Quantity: ${quantity}`)

            await this.bot.getMessages(channel.id, { limit: quantity, before: lastMsg })
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
                    return [
                        `[${moment(this.utils.convertSnowflakeToDate(msg.id)).format('MMMM Do YYYY hh:mm a')}]`,
                        `${msg.author.username}#${msg.author.discriminator} (${msg.author.id}):\nContent: ${msg.content}\nAttachments: ${imgurLinks.join(', ') || null}\nMessage ID: ${msg.id}\r\n\r\n`
                    ].join(' ');
                }); 

                messages.push(`Messages Archived on ![](${channel.guild.dynamicIconURL('png', 32)}) **${channel.guild.name}** - **${channel.name} (${channel.id})** --\r\n\r\n`);
                messages = messages.reverse().join('');

                const data = Buffer.from(messages, 'utf8');
                fs.writeFile(`Archives/${channel.name}.md`, data, (err) => {
                    if (err !== null) { this.sendError(msg.channel, `An error occurred while creating the text file: ${err}`) };
                });
            })
                this.sendSuccess(msg.channel, `Successfully archived ${channel.name}`)
                console.info(`Finished archiving ${channel.name}.`)
        } catch (err) {
            this.utils.logError(msg, err, 'internal', 'Something went wrong.');
        }
    }
}


module.exports = Archive; 
