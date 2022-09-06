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
            description: 'Uploads archive files to Discord',
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

    async execute({msg}) {
        let files = readdirSync('Archives');
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
    }
}

module.exports = GetArchive;