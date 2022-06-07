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
}

module.exports = ExtraUtils;
