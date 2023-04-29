'use strict';

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const nagaSchema = new Schema({
	prefix:     { type: String, default: 'n.' },
	modules:    { type: Object, default: {}  },
	commands:   { type: Object, default: {}  },
	webhooks:   { type: Array,  default: []  },
	testGuilds: { type: Array,  default: []  },
	betaGuilds: { type: Array,  default: []  },
	dashAccess: { type: Array,  default: []  },
	globalBans: { type: Array, default: [] },
	ignoredUsers: { type: Array, default: [] },
}, { strict: false });

export = { name: 'Naga', schema: nagaSchema }
