'use strict';

import Datastore from './Datastore';
import config from '../../config/config';

const dbString = config.database.dsn;

if (!dbString) {
	throw new Error('Missing environment variable CLIENT_MONGO_URL.');
}

const db = new Datastore({
	dbString,
	disableReplica: false,
	logger: {
		level: config.logLevel || 'error',
	},
});

export default db;
