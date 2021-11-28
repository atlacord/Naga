const Chariot = require('chariot.js');
require('dotenv').config(); 


class Umi extends Chariot.Client {
    constructor() {
        super(new Chariot.Config(
            process.env.TOKEN, 
            {
                prefix: ['??', '@mention'],
                guildPrefixes: [
                    { guildID: '<Guild 1>', prefix: '?' },
                    { guildID: '<Guild 1>', prefix: ';' }
                ],
                defaultHelpCommand: true,
                primaryColor: '89cff0',
                owner: [
                    '123261299864895489'
                ],
                 customLocales: {
                    missingPermissions: 'Command **{command}** requires following permissions: **{missingPermissions}**',
                    owner: 'You should not be playing around with this! I only listen to TwoDog for this!',
                    cooldown: 'Just wait **{timeLeftFormatted}** before spamming **{command}** yet again ...',
                    nsfw: 'Oi you naughty lil thang, **{command}** is an NSFW command and cannot be used here.',
                    userPermissions: {
                        title: 'Hold up ...',
                        description: 'You gtotta have these permissions before you can do this! **{missingUserPermissions}**',
                    }
                }
            },
            {
                messageLimit: 50,
                defaultImageFormat: 'png',
                allowMentions: {
                    everyone: false,
                    roles: false,
                }
                
            }
        ));
    }
}

module.exports = new Umi();