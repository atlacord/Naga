'use strict';

import Redis from 'ioredis';
const logger = require('./Logger');

async function connect() {
	return new Promise((resolve, reject) => {
		const client = new Redis({
			host: process.env.REDIS_HOST || '127.0.0.1',
			port: 6379,
            username: process.env.REDIS_USERNAME,
            password: process.env.REDIS_PASSWORD
		});

		let errorCount = 0;

		const rejectFunc = (err) => {
			errorCount += 1;
			if(errorCount >= 50) {
				process.exit(1);
			}
		};

		client.on('ready', () => {
			logger.info('Connected to redis.');
			client.removeListener('error', rejectFunc);
			resolve(client);
		});

		client.on('error', rejectFunc);

		client.on('error', err => {
			logger.error(err);
		});
	});
}

export default { connect };
