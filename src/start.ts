import Naga from './Core/Naga';
import { readFileSync } from 'fs';
import util from 'util';
import { exec } from 'child_process';
import config from './Core/Config';

const naga = new Naga();

let logo = require('./logo');
logo = logo.join('\n');

function log(...args: any[]) {
	process.stdout.write(`${util.format.apply(null, args)}\n`);
}

async function init() {
    log(logo);
    log(`${config.name} ${config.stateName} ${config.pkg.version}`, '\n');

    if (config.stateName === 'Development') {
        try {
            log(`Recent Git commits:`);
            await gitInfo();
        } catch (err) {
            console.error(err);
        }
    }
    naga.setup(naga.config.client.options);
}

function gitInfo(): Promise<void> {
	return new Promise((res, rej) =>
		exec('git log -n 3 --no-color --pretty=format:\'[ "%h", "%s", "%cr", "%an" ],\'', (err, stdout) => {
			if (err) {
				return rej(err);
			}

			let str = stdout.split('\n').join('');
			str = str.substr(0, str.length - 1);

			let lines = JSON.parse(`[${str}]`);
			lines = lines.map((l: any) => `[${l[0]}] ${l[1]} - ${l[2]}`);
			log(`${lines.join('\n')}\n`);
			return res();
		}));
}

init();
