const Bot = require('./Bot');
const chalk = require('chalk');
const config = require('../configs/config.json');

if (config.settings.db === 2) {
    try {
        const mongoose = require('mongoose');
        mongoose.connect(`mongodb+srv://momo1:maniloveotters@cluster0.r8hji.mongodb.net/?retryWrites=true&w=majority`, {
            useCreateIndex: true,
            autoReconnect: true,
            useNewUrlParser: true,
        })
            .then( () => {
                Bot.logger.notice('Successfully connected to database');
            } )
            .catch(err => {
                Bot.logger.fatal(`Error connecting to database\n${err.stack}`);
            } );
    } catch (e) {
        Bot.logger.fatal(`Could not connect to database\n${e.stack}`);
    }
}

Bot.start();

Bot.logger.notice(`${chalk.green('=== ONLINE ===')}`);
