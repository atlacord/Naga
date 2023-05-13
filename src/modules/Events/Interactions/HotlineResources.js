const { Listener } = require('axoncore');
const countries = require('../../../assets/Hotlines.json');
const HOTLINE_ROLE = '1106789319240335460'

class HotlineResources extends Listener {
    /**
     * @param {import('axoncore').Module} module
     * @param {import('axoncore').ListenerData} data
     */
    constructor(module, data = {} ) {
        super(module, data);

        /** Event Name (Discord name) */
        this.eventName = 'interactionCreate';
        /** Event name (Function name) */
        this.label = 'interactionCreate-HotlineResources';

        this.enabled = true;

        this.info = {
            description: 'Handles the self-care resources channel',
        };
    }

    /**
     * @param {import('eris').Message} msg
     */

    async execute(interaction) { // eslint-disable-line
        if (interaction.acknowledged) return;
        if (interaction.data.component_type === 2 && interaction.data.custom_id === 'hotline_inputcountry_button') {
            interaction.createModal({
                title: 'Enter your country',
                custom_id: 'hotline_countryinput_modal',
                components: [{
                    type: 1,
                    components: [{
                        type: 4,
                        custom_id: 'hotline_countries',
                        style: 1,
                        label: 'Enter your country',
                        min_length: 2,
                        max_length: 64,
                        required: true,
                        placeholder: 'Australia'
                    }]
                }]
            });
        }

        if (interaction.data.custom_id === 'hotline_countryinput_modal') {
            let success = false;
            let embed = {};

            for (let i in countries) {
                let country = countries[i];
                if ((country['COMMON_NAME'].toLowerCase() === interaction.data.components[0].components[0].value.toLowerCase()) || (country['COUNTRY_CODE'] === interaction.data.components[0].components[0].value.toUpperCase())) {
                    let resources = this.utils.splitMessage(country['CRISIS_RESOURCES'], 1024)[0];
                    if (resources === undefined) {
                        resources = 'N/A';
                    };

                    let joinedNumbers = [];
                    let emergencyNumbers = country['EMERGENCY_NUMBERS'];
                    if (emergencyNumbers === undefined) {
                        emergencyNumbers = 'N/A';
                    } else {
                        if (emergencyNumbers.split(' ').length > 1) {
                            emergencyNumbers.split(' ').forEach((number) => {
                                if (number.length >= 3) {
                                    joinedNumbers.push(number);
                                }
                            });
                            emergencyNumbers = joinedNumbers.join(', ');
                        };
                    }
            
                    embed.title = country['COMMON_NAME'];
                    embed.color = this.utils.getColor('pink');
                    embed.thumbnail = {}
                    embed.fields = [];
                    embed.fields.push({ name: 'Emergency Numbers', value: emergencyNumbers, inline: false });
                    embed.fields.push({ name: 'Crisis Resources', value: resources, inline: false });
                    embed.thumbnail.url = `https://raw.githubusercontent.com/hampusborgos/country-flags/main/png1000px/${country['COUNTRY_CODE'].toLowerCase()}.png`;
                    success = true;
                    continue;
                }
            };

            let errorEmbed = {
                color: this.utils.getColor('red'),
                description: 'Country not found.'
            }

            if (success === false) {
                embed = errorEmbed;
            }

            interaction.createMessage({
                flags: 64,
                embeds: [embed]
            })
        }
        if (interaction.data.component_type === 2 && interaction.data.custom_id === "hotline_exit_button") {
            interaction.channel.guild.removeMemberRole(interaction.member.id, HOTLINE_ROLE, "User self-exited the resources channel");
        }
    }
}

module.exports = HotlineResources;
