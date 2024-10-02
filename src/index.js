const Bot = require('./Bot');
const chalk = require('chalk');
const cron = require('node-cron');
const config = require('../configs/config.json');
const CommandHandler = require('./CommandHandler');
require('dotenv').config()

if (config.settings.db === 2) {
    try {
        const mongoose = require('mongoose');
        mongoose.connect(process.env.PROD_DATABASE, {
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

Bot.start()
.then(
    cron.schedule('0 0 0 * * *', () => {
        Bot.commandRegistry.get('checkbirthday').execute();
        Bot.commandRegistry.get('loadpermissions').execute();
        // Bot.commandRegistry.get('duplicatebending').execute();
        console.log('Checking for new birthdays, clearing duplicate bending roles, reloading staff permissions...');
    }),
    cron.schedule('0 0 */12 * * *', () => {
        Bot.commandRegistry.get('duplicatebending').execute();
        console.log('Clearing duplicate bending roles...');
    }),
    cron.schedule('0 0 * * 0', () => {
        Bot.commandRegistry.get('changebanner').execute();
        console.log('Changing server banner.');
    }),
    // new EventHandler(),
    new CommandHandler(),
);

Bot.logger.notice(`${chalk.green('=== ONLINE ===')}`);
