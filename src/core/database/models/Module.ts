'use strict';

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const moduleSchema = new Schema({
	name: { type: String, index: true, required: true },
	_state: { type: Number, index: true },
}, { strict: false });

export = { name: 'Module', schema: moduleSchema }
