class watch extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'watch';
        this.aliases = [ 'an', 'anotify', 'tellmewhenthisshitairs' ];

        this.hasSubcmd = false;

        this.info = {
            name: 'watch',
            description: 'watch',
            usage: 'watch [Mal link]',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 0,
            cooldown: 10000,
            guildOnly: true,
        } );


    }
    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    async execute( { msg, args } ) {      
        
        
        
        
        
        
        
        
        // Command End
    }
}


module.exports = watch;
