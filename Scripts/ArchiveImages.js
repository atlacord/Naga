const events = require('events');
const https = require('https');
const path = require('path');
const { createReadStream, createWriteStream, existsSync, mkdirSync, readdirSync, renameSync, writeFile } = require('fs');
const axios = require('axios');
const readline = require('readline');
const { promisify } = require('util');
const stream = require('stream');
const replace = require('replace-in-file');

const finished = promisify(stream.finished);

function writeToFile(name, data) {
    writeFile(`./Archives/${name}.txt`, data, 'utf8', function (err) {
        if (err) return console.log(err)
    })
}

async function downloadFile(prefix, fileUrl, outputPath) {
  const writer = createWriteStream(outputPath);
  let fpath = null;
  return axios({
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
    .on('finish', () => {
        setTimeout(() => {}, 5000);
        console.log(`[${prefix}] Finished downloading ${fileUrl}`);
        return [finished(writer), fpath];
    });
    return fpath;
  }).catch((err) => {
    console.log(err);
  });
}

const archives = readdirSync('Archives');
let channels = [];
archives.forEach(channel => {
    let channelName = channel.slice(0, -4);
    if (path.extname(channel) === ('.md' || '.txt')) {
        channels.push(channelName)
        mkdirSync(`./Archives/${channelName}/Images`, { recursive: true });
    }
})
channels = channels.sort();
for (let i = 0; i < channels.length; i += 1) {
    if (channels[i] === 'Images') {
        return;
    }
    let channelName = channels[i];
    async function processLineByLine() {
    try {
        const ws =  createWriteStream(`./Archives/${channelName}.md`, { flags: 'r+', defaultEncoding: 'utf8' })
        ws.isTTY = true
        const rl = readline.createInterface({
        input: createReadStream(`./Archives/${channelName}.md`),
        output: ws,
        crlfDelay: Infinity
        });

        let ins = 0;

        for await (let line of rl) {
            if (line.includes('Attachments') && (!line.includes('null'))) {
                ins += 1;
                let attachment = line.split(' ')
                // let imgur = await uploadImage(client, attachment[1]);
                await downloadFile(channelName, attachment[1], `./Archives/${channelName}/Images/${ins}.${attachment[1].slice(-3)}`);

                let options = {
                    files: `./Archives/${channelName}.md`,
                    from: attachment[1],
                    to: `./Archives/${channelName}/Images/${ins}.${attachment[1].slice(-3)}`,
                    countMatches: true,
                }
                try {
                    const res = await replace(options);
                    console.log(res);
                } catch (error) {
                    console.error(error);
                }
            }
        };
        await rl.on('close', function() {
            ws.close();
        })
    } catch (err) {
        console.error(err);
    }
    };
    processLineByLine();
}