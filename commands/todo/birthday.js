const Chariot = require('chariot.js');
const colour = require('../../Util/colorconfig.json')
const {
    bdaySet, 
    bdayRemove, 
    bdayList, 
    bdayNext, 
    bdayAlert, } = require('../../Util/BirthdayFunctions')


class Birthday extends Chariot.Command {
    constructor() {
        super();

        this.name = 'birthday';
        this.cooldown = 5;
        this.allowDMs = false;
        this.aliases = ['bd', 'birthdays']
        this.help = {
            message: 'Birthday Action Center!',
            usage: ['birthday', 'birthday set MM-DD', 'birthday remove', 'birthday list', 'birthday next'],
            example: ['birthday set 06-27'],
            inline: true
        }
    }
// Set Subcommand
    async set(message, args, chariot) {
        bdaySet(message, args)
    }
// Remove subcommand
    async remove(message, args, chariot) {
     bdayRemove(message);
    }

// list Subcommand 
async list(message, args, chariot) {
    bdayList(message)
   }

   async next(message, args, chariot) {
    bdayNext(message)
   }


    async execute(message, args, chariot) {
// Command Goes here!
        message.channel.createEmbed(
                new Chariot.RichEmbed()
                .setTitle("Birthday Management")
                .setDescription("Use one of the following commands to continue!")
                .addField("**set**", "Set your birthday! (MM-DD)", true)
                .addField("**remove**", "Removes your birthday from the Database", true)
                .addField("**list**", "Lists all the birthdays on the Database")
                .addField("**next", "Shows the next 3 birthdays coming up", true)
        
            )

    }
}

module.exports = new Birthday();