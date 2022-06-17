const { Utils } = require('axoncore');

class ExtraUtils extends Utils {
    /**
     * @param {import('axoncore').AxonClient} client
     */
    constructor(client) {
        super(client);
        this.invite = /^(discord.gg\/|discordapp.com\/invite\/)([a-z0-9]+)$/gi;
    }

    /**
     * Convert a hex code into a rgb code
     *
     * @param {String} hex -  The base10 number to convert OR the base10 number as a String
     * @returns {[Number, Number, Number]} rgb color code `[xxx, xxx, xxx]`
     */
    hexToRgb(hex) {
        const num = parseInt(hex.replace('#', ''), 16);
        return [
            num >> 16,
            (num >> 8) & 255,
            num & 255,
        ];
    }

    color = {
        red: "15747399",
        yellow: "16439902",
        green: "4437377",
        blue: "9031664",
        dblue: "26544",
        spotify: "1947988"
    };
    
    emote = {
        "error": "<:no:917982868922335272>",
        "success": "<:yes:917982955362734100>"
    };

    getStaff() {
        return this.axon.staff
    }

    /**
    * Convert a rgb code into a hex code
    *
    * @param {Number} red - RGB value for Red
    * @param {Number} green - RGB value for Green
    * @param {Number} blue - RGB value for Blue
    * @returns {String} Hex color code (6 char) (without #)
    */
    rgbTOhex(red, green, blue) {
        return ( (blue | (green << 8) | (red << 16) ) | (1 << 24) ).toString(16).slice(1);
    }

    /**
    * Joins array via oxford comma and append 'and' on last 2 items
    * @param {array} array the array to join
    * @returns {string} the joined array
    */
    joinArray(array = []){
        return list.format(array.map(x => String(x)));
    }

        /**
     * TextTruncate -> Shortens the string to desired length
     * @param {string} str the string to test with
     * @param {number} length the length the string should have
     * @param {string} end the end of the string indicating it's truncated
     * @returns {string} Truncated string
     */
    textTruncate(str = '', length = 100, end = '...') {
        return String(str).substring(0, length - end.length) + (str.length > length ? end : '');
    }

    truncate(...options) {
        return textTruncate(...options);
    }

    /**
     * Converts number to string and adds a comma separator
     * @param {number|string} number the Number to convert
     * @param {number} maximumFractionDigits the number of decimal places to include in result
     * @example commatize(11235) will return `11,235`; commatize(1234.567, 2) will return `1,234.57`
     * @returns {string} number with commas
     * @note Numbers greater than 10e307 will return '∞'
     */
    commatize(number, maximumFractionDigits = 2) {
        return Number(number || '')
        .toLocaleString('en-US', { maximumFractionDigits });
    }

        /**
     * Appends ordinal suffixes to input numbers. Max input before failing is 10e307
     * @param {number|string} n the Number to append ordinal suffix to
     * @example ordinalize(10) -> returns `10th`; ordinalize(22) -> returns `22nd`
     * @returns {string} Ordinalized number
     * @note Does not support negative numbers!
     */
    ordinalize(n = 0) {
        return Number(n) + [,'st','nd','rd'][n/10%10^1&&n%10] || Number(n )+'th';
    }

        /**
     * Converts a number to a stringified compact version
     * @param {number|string} number the Number to convert
     * @param {number} maximumFractionDigits the number of decimal places to include in result
     * @example compactNum(11235) will return `11.24K`; commatize(1234.567, 0) will return `1K`
     * @returns {string} compact version of the number
     * @note Maximum number for optimal usage is 10e13
     */
    compactNum(number, maximumFractionDigits = 2) {
        return Number(number || '')
        .toLocaleString('en-US', {
          notation: 'compact', maximumFractionDigits
        });
    }

    /**
     * 
     * @param {string} user User ID
     * @returns {string} member's display name
     */
    displayName(user) {
        return this.bot.getRESTGuildMember(user).nick ?? this.bot.getRESTUser(user).username;
    }

    checkStaff(user) {
        let staff = []

        if (this.axon.staff.owners.includes(user.id)) {
            staff.push('Naga Developer');
        }

        if (user.roles.includes('987192421462990909')) {
            staff.push('White Lotus');
        };

        if ((user.roles.includes('987192454451179561')) && (!user.roles.includes('987192421462990909'))) {
            staff.push('Sentry');
        }

        if (user.roles.includes('987192477217869886')) {
            staff.push('Dai Li');
        }

        if (user.roles.includes('987192500081016832')) {
            staff.push('Wiki Writer');
        }

        if (user.roles.includes('987192524533801001')) {
            staff.push('Event Master');
        }

        if (user.roles.includes('987192556318248960')) {
            staff.push('Stream Master')
        }
        return staff;
    }
}

module.exports = ExtraUtils;
