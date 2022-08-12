const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const https = require('https');
const path = require('path');
const { createReadStream, createWriteStream, mkdirSync, readdirSync, readFileSync, unlink } = require('fs');
const axios = require('axios');
const readline = require('readline');
const { promisify } = require('util');
const stream = require('stream');
const replace = require('replace-in-file');

const MESSAGE_QUANTITY = 400000;

const finished = promisify(stream.finished);

const archives = readdirSync('Archives');
const IMAGE_CHANNEL = '1004202430776479824'

class ArchiveImages extends Command {

    /**
     * @param {import('axoncore').Module} module
     */

    constructor(module) {
        super(module);

        this.label = 'archiveimages';
        this.aliases = [];

        this.hasSubcmd = false;

        this.info = {
            name: 'archiveimages',
            description: 'Archives images (please only use once you run channel archives)',
            usage: 'archiveimages',
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

    async downloadFile(prefix, fileUrl, outputPath, i, ext) {
        const writer = createWriteStream(outputPath);
        await axios({
          method: 'get',
          url: fileUrl,
          responseType: 'stream',
          timeout: 60000,
          httpsAgent: new https.Agent({ keepAlive: true }),
        }).then((response) => {
          response.data.pipe(writer)
          .on('error', () => {
                console.log(error)
          })
          .on('finish', async () => {
              setTimeout(() => {}, 5000);
              console.log(`[${prefix}] Finished downloading ${fileUrl}`);
              let img = readFileSync(outputPath);
              await this.bot.getChannel(IMAGE_CHANNEL).createMessage(`${prefix}-${i}`, {
                file: img,
                name: `${prefix}-${i}.${ext}`
              });
              unlink(outputPath, (err => {
                if (err) {
                    console.log(err)
                }
              }));
              // message = message.attachments[0].url;
              return [finished(writer)];
          });
        }).catch((err) => {
            console.log(err);
        });
    }

    async processLineByLine(channelName) {
        try {
            const ws =  createWriteStream(`Archives/${channelName}.md`, { flags: 'r+', defaultEncoding: 'utf8' })
            ws.isTTY = true
            const rl = readline.createInterface({
            input: createReadStream(`Archives/${channelName}.md`),
            output: ws,
            crlfDelay: Infinity
            });
    
            let ins = 0;
    
            for await (let line of rl) {
                if (line.includes('Attachments') && (!line.includes('null'))) {
                    ins += 1;
                    let attachment = line.split(' ')
                    let path = null;
                    let lastMsg = await this.bot.getChannel(IMAGE_CHANNEL).lastMessageID;

                    await this.downloadFile(channelName, attachment[1], `Archives/${channelName}/Images/${ins}.${attachment[1].slice(-3)}`, ins, attachment[1].slice(-3));
                    await this.bot.getMessages(IMAGE_CHANNEL, { limit: MESSAGE_QUANTITY, before: lastMsg })
                    .then(async messages => {
                        messages.filter(Boolean).map(async msg => {
                            if (msg.content === `${channelName}-${ins}`) {
                                path = msg.attachments[0].url;
                                let options = {
                                    files: `Archives/${channelName}.md`,
                                    from: attachment[1],
                                    to: path,
                                    countMatches: true,
                                }
                                try {
                                    const res = await replace(options);
                                    console.log(res);
                                } catch (error) {
                                    console.error(error);
                                }
                            }
                        })
                    })
                }
            };
            await rl.on('close', function() {
                ws.close();
            })
        } catch (err) {
            console.error(err);
        }
    };

    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    async execute({msg, args}) {
        let channels = [];
        archives.forEach(channel => {
            let channelName = channel.slice(0, -3);
            if (path.extname(channel) === ('.md')) {
                channels.push(channelName)
                mkdirSync(`Archives/${channelName}/Images`, { recursive: true });
            }
        })

        channels = channels.sort();
        for (let i = 0; i < channels.length; i += 1) {
            if (channels[i] === 'Images') {
                return;
            }

            let channelName = channels[i];
            this.sendSuccess(msg.channel, `Exporting images from ${channelName} (${i + 1}/${channels.length})`);

            if (i === (channels.length - 1)) {
                this.sendSuccess(msg.channel, 'Successfully exported images! Run \`n.getarchive\` to upload the channel archives to Discord.')
            }
            
            await this.processLineByLine(channelName);
        }
    }
}

module.exports = ArchiveImages;