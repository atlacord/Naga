const { Command, CommandOptions, CommandPermissions } = require('axoncore');
const events = require('events');
const https = require('https');
const path = require('path');
const { createReadStream, createWriteStream, existsSync, mkdirSync, readdirSync, readFileSync, renameSync, unlink, writeFile } = require('fs');
const axios = require('axios');
const readline = require('readline');
const { promisify } = require('util');
const stream = require('stream');
const replace = require('replace-in-file');

const MESSAGE_QUANTITY = 400000;

const finished = promisify(stream.finished);

function writeToFile(name, data) {
    writeFile(`./Archives/${name}.txt`, data, 'utf8', function (err) {
        if (err) return console.log(err)
    })
}

const archives = readdirSync('Archives');
const IMAGE_CHANNEL = '1007299370804322354'

class GetArchive extends Command {

    /**
     * @param {import('axoncore').Module} module
     */

    constructor(module) {
        super(module);

        this.label = 'getarchive';
        this.aliases = [];

        this.hasSubcmd = false;

        this.info = {
            name: 'getarchive',
            description: 'Uploads archive files to Discord. Use without an argument to get all files or provide a channel ID to get a specific file.',
            usage: 'getarchive',
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

    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    async execute({msg, args}) {
        let files = readdirSync('Archives');

        if (args.length === 0) {
            files.forEach(channel => {
                let channelName = channel.slice(0, -3);
                if (path.extname(channel) === ('.md')) {
                    let file = readFileSync(`Archives/${channel}`);
                    msg.channel.createMessage({}, {
                        name: `${channelName}.md`,
                        file: file      
                    })
                }
            })
        } else {
            let channel;
            try {
                channel = this.bot.getChannel(args[0]) || await this.bot.getRESTChannel(args[0])
            } catch (err) {
                console.log(err);
                return this.sendError(msg.channel, 'Invalid channel!');
            }

            const fileName = files.find((f) => f.startsWith(channel.name));
            if (!fileName) return this.sendError(msg.channel, 'Could not find archive file!');

            const file = readFileSync(`Archives/${fileName}`);
            msg.channel.createMessage({}, {
                name: `${msg.channel.name}.md`,
                file: file
            });
        }
    }
}

module.exports = GetArchive;