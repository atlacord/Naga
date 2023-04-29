'use strict';

import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
const Logger = require('../Logger');
const basename = path.basename(module.filename);
const modelPath = path.join(__dirname, 'models');

class Datastore {
	logger: typeof Logger;
	_models: any;
	constructor(options) {
		this.logger = Logger;
		this._models = {};

		this.logger.info('Connecting to database...');

		mongoose.Promise = global.Promise;

		const connectOpts = {
			connectTimeoutMS: 30000,
			// replicaSet: 'naga',
		};

		// if (!options.disableReplica) {
		// 	connectOpts.replicaSet = 'naga';
		// }

		mongoose.connect(options.dbString, connectOpts);

		const connection = mongoose.connection;

		connection.on('error', (err) => this.logger.error(err));
		connection.once('open', () => this.logger.info('Successfully connected to database.'));

		fs
			.readdirSync(modelPath)
			.filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
			.forEach(file => {
				const model = require(path.join(modelPath, file));
				this.registerModel(model);
			});
	}

	get models() {
		return this._models;
	}

	get mongoose() {
		return mongoose;
	}

	get connection() {
		return mongoose.connection;
	}

	collection(...args) {
		return mongoose.connection.collection(`${[0, 1, 2]}`);
	}

	get Schema() {
		return mongoose.Schema;
	}

	registerModel({name, schema}) {
		const model = mongoose.model(name, schema);
		this._models[model.modelName] = model;
	}
}

export default Datastore;
