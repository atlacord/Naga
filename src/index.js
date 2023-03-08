const Bot = require('./Bot');
const chalk = require('chalk');
const cron = require('node-cron');
const config = require('../configs/config.json');
const CommandHandler = require('./CommandHandler');

if (config.settings.db === 2) {
    try {
        const mongoose = require('mongoose');
        mongoose.connect(`mongodb://Nanami:gQDyc6UonQdUCdSk@nanami-shard-00-00.xl1ps.mongodb.net:27017,nanami-shard-00-01.xl1ps.mongodb.net:27017,nanami-shard-00-02.xl1ps.mongodb.net:27017/Nanami?ssl=true&replicaSet=atlas-11dg2z-shard-0&authSource=admin&retryWrites=true&w=majority`, {
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
.then(cron.schedule('0 0 0 * * *', () => {
    Bot.commandRegistry.get('checkbirthday').execute();
    Bot.commandRegistry.get('loadpermissions').execute();
    Bot.commandRegistry.get('duplicatebending').executre();
  console.log('Checking for new birthdays, clearing duplicate bending roles, reloading staff permissions...');
}),
// new EventHandler(),
new CommandHandler(),
);

Bot.logger.notice(`${chalk.green('=== ONLINE ===')}`);
