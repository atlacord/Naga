const { Command, CommandOptions } = require('axoncore');
const profile = require('../../../Models/Profile');

class CreditLeaderboard extends Command {
    /**
     * @param {import('axoncore').Module} module
     */
    constructor(module) {
        super(module);

        this.label = 'creditlb';
        this.aliases = [
            'creditslb'
        ];

        this.hasSubcmd = false;

        this.info = {
            name: 'creditlb',
            description: 'Displays a credit leaderboard',
            usage: 'beg',
        };

        /**
         * @type {CommandOptions}
         */
        this.options = new CommandOptions(this, {
            argsMin: 0,
            cooldown: 30000,
            guildOnly: true,
        } );
    }
    /**
     * @param {import('axoncore').CommandEnvironment} env
     */

    async execute({ msg }) {
        
        try { 
            profile.find({ 'data.xp.id': msg.channel.guild.id }, async (err, docs) => {
            if (err) {
                return this.sendError(msg.channel, `DB Error: ${err}`);
            };

            docs = docs.map(x => { return { id: x._id, wallet: x.data.economy.wallet, bank: x.data.economy.bank}; })
            .sort((A,B) => ((B.wallet || 0) + (B.bank || 0)) - ((A.wallet || 0) + (A.bank || 0))).filter(x => Boolean(x.wallet || 0 + x.bank || 0));

            if (!docs.length) {
                return this.sendError(msg.channel, 'Members have not started earning credits yet.');
            };
            const members = await this.bot.getRESTGuildMembers(msg.channel.guild.id, docs.slice(0,10).map(x => x.id));

            let embed = {
                color: this.utils.color.blue,
                author: { name: 'Credit Leaderboard' },
                fields: [
                    { name: `**${msg.channel.guild.members.get(docs[0].id)?.nick || 'Unknown Member'}** ranked the highest with **${this.utils.commatize(docs[0].wallet + docs[0].bank)}** credits!`, value:
                    [
                        '```properties',
                        '╭═══════╤════════╤═════════╤════════════════════════════╮',
                        '┃  Rank ┃ Wallet ┃    Bank ┃ User                       ┃',
                        '╞═══════╪════════╪═════════╪════════════════════════════╡',
                        docs.slice(0,10).map((u,i) => {
                          const rank = String(i+1);
                          return [
                            '┃' + ' '.repeat(6-rank.length) + rank,
                            ' '.repeat(6-this.utils.compactNum(u.wallet).length) + this.utils.compactNum(u.wallet),
                            ' '.repeat(7-this.utils.compactNum(u.bank).length) + this.utils.compactNum(u.bank),
                            msg.channel.guild.members.get(u.id)?.user.username || '<Unknown User>'
                          ].join(' ┃ ')
                        }).join('\n'),
                        '╞═══════╪════════╪═════════╪════════════════════════════╡',
                        docs.filter(x => x.id === msg.author.id).map((u,i,a) => {
                          const user = a.find(x => x.id === msg.author.id);
                          const rank = docs.findIndex(x => x.id === msg.author.id) + 1;
                          return [
                            '┃' + ' '.repeat(6-this.utils.ordinalize(rank).length) + this.utils.ordinalize(rank),
                            ' '.repeat(6-this.utils.compactNum(u.wallet).length) + this.utils.compactNum(u.wallet),
                            ' '.repeat(7-this.utils.compactNum(u.bank).length) + this.utils.compactNum(u.bank),
                            this.utils.truncate('You (' + msg.author.username + ')', 26) + ' '.repeat(27-this.utils.truncate('You (' + `${msg.author.username}#${msg.author.discriminator}` + ')', 26).length) + '┃'
                          ].join(' ┃ ')
                        }).join(''),
                        '╰═══════╧════════╧═════════╧════════════════════════════╯',
                        '```'
                    ].join('\n')
                }]
            }
            this.sendMessage(msg.channel, { embed });
        })
    } catch (err) {
        this.sendError(msg.channel, err);
    }
} 
}

module.exports = CreditLeaderboard;