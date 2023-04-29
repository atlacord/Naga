'use strict';

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const guildLogSchema = new Schema({
  id:     { type: String, required: true, index: true },
  guild:  { type: Object, required: true },
  action: { type: String, required: true },
  time:   { type: Date, default: Date.now },
});

export = { name: 'GuildLog', schema: guildLogSchema }
