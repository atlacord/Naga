'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-long')(mongoose);

class ServerSchema {
    schema = Schema
	constructor() {
		this.schema = new Schema({
			_id:      { type: String },
			longId:	  { type: Schema.Types.Long, index: true },
			prefix:   { type: String, default: 'n.' },
			modules:  { type: Object, default: {} },
			commands: { type: Object, default: {} },
			mods:     { type: Array,  default: [] },
			modRoles: { type: Array,  default: [] },
			modonly:  { type: Boolean, default: false },
			deleted:  { type: Boolean, default: false, index: true },
			debug:    { type: Boolean },
			beta:     { type: Boolean },
            private:  { type: Boolean },
			createdAt: { type: Date, default: Date.now }, // Date when schema was created
			updatedAt: { type: Date, default: Date.now }, // Date of last update
		}, { strict: false });

		this.schema.statics.findAndPopulate = this.findAndPopulate;
		this.schema.methods.format = this.format;

		return this.schema;
	}

	findAndPopulate(id) {
		return new Promise((resolve, reject) => {
			this.findOne({ _id: id })
				.populate('permissions')
				.exec()
				.catch(reject)
				.then(doc => {
					if (!doc) return resolve();
					return resolve(doc.format());
				});
		});
	}

	format() {
		if (!this.permissions || !this.permissions.length) return this;

		this.rolePermissions = this.permissions.reduce((a, o) => {
			if (o.type === 1 || !o.channel) return a;
			a[o.id] = o;
			return a;
		}, {});

		this.channelPermissions = this.permissions.reduce((a, o) => {
			if (o.type === 2 || !o.channel) return a;
			a[o.id] = o;
			return a;
		}, {});

		return this.toObject();
	}
}

/**
 * Server model
 * @type {"mongoose".Model<serverSchema>}
 */
module.exports = { name: 'Server', schema: new ServerSchema() }
