'use strict';

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id:        { type: String },
    profile:    {
        bio:        { type: String, default: 'No bio written.' },
        background: { type: String, default: null },
        pattern:    { type: String, default: null },
        emblem:     { type: String, default: null },
        hat:        { type: String, default: null },
        wreath:     { type: String, default: null },
        color:      { type: String, default: null },
        birthday:   { type: String, default: null },
        inventory:  { type: Array,  default: [] },
        gacks:      { type: String, default: null },
        acks:       { type: Array,  default: [] },
        wikipage:   { type: String, default: null }
    },
    economy: {
        bank:   { type: Number, default: null },
        wallet: { type: Number, default: null },
        streak: {
          alltime:      { type: Number, default: 0 },
          current:      { type: Number, default: 0 },
          timestamp:    { type: Number, default: 0 }
        },
        title:  { type: String, default: null },
        beg:    { type: Date,   default: 0 },
        shard:  {type: Number,  default: null }
    },
    tips: {
        given:      { type: Number, default: 0 },
        received:   { type: Number, default: 0 },
        timestamp:  { type: Number, default: 0 }
    },
    last_level_up:      { type: Date,   default: 0 },
    level:              { type: Number, default: 0 },
    birthdayTimestamp:  { type: Date,   default: 0 },
}, { strict: false });

export = { name: 'User', schema: userSchema }