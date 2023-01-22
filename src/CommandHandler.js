const Eris = require('eris');
const config = require('../configs/config.json');
const secret = require('../configs/secret.json');
const { readFileSync, writeFileSync } = require('fs');
const topics = require('./assets/topics.json');

const COMMAND_COOLDOWN = 600000;

const Constants = Eris.Constants;
const discordgrey = 2632496;
const wlcolour = 16777215;
const sentrycolour = 9725695; 
const dailicolour = 5628531;

class CommandHandler {
    constructor() {
        const bot = new Eris(secret.bot.token, {
            intents: [ 
                'guilds',  
                'guildBans', 
                'guildEmojis', 
                'guildIntegrations',
                'guildWebhooks',
                'guildInvites',
                'guildVoiceStates',
                'guildMessages',
                'guildMessageReactions',
                'guildMessageTyping',
                'directMessages',
                'directMessageReactions',
                'directMessageTyping',
                'guildPresences',
                'guildMembers'
            ]
        });

        bot.on("ready", async () => { // When the bot is ready
            console.log("Slash command handler ready!"); // Log "Ready!"

            //Note: You should use guild commands to test, as they update instantly. Global commands can take up to an hour to update.

            const commands = await bot.getCommands();

            if(!commands.length) {
                bot.createCommand({
                    name: "topic",
                    description: "Topic",
                    type: Constants.ApplicationCommandTypes.CHAT_INPUT //Not required for Chat input type, but recommended
                }); //Create a chat input command
            }
        });

        bot.on("error", (err) => {
            console.error(err); // or your preferred logger
        });

        function handleCooldown() {
            let data = readFileSync('src/assets/cooldown.json');
            let lastUsed = JSON.parse(data);

            const timeLeft = Date.now() - lastUsed;
            if (timeLeft <= COMMAND_COOLDOWN) {
                let time = Math.ceil((600000 - timeLeft) / 100) / 10
                let minutes = Math.floor(time / 60);
                let seconds = Math.ceil(time - minutes * 60);
                if (minutes === 0) {
                    return `${seconds} sec`;
                } else {
                    return `${minutes} minutes ${seconds} seconds`;
                }
            } else return false;
        }

        function getColor(color) {
            let colors = {
            red: 15747399,
            yellow: 16439902,
            green: 4437377,
            blue: 9031664,
            darkblue: 26544,
            spotify: 1947988
            }
    
            return colors[color];
        }

        bot.on("interactionCreate", async (interaction) => {
            if(interaction instanceof Eris.CommandInteraction) {
                switch(interaction.data.name) {
                    case "topic":
                        let timeRemaining = handleCooldown();
                        if (timeRemaining !== false) {
                            return interaction.createMessage(`This command has already been used recently!\nTry again in **${timeRemaining}**!`);
                        }
                        const topic = Math.floor(Math.random() * topics.length);
                        
                        return interaction.createMessage({
                            embed: {
                                color: getColor('blue'),
                                description: topics[topic],
                            }
                        }).then(writeFileSync('src/assets/cooldown.json', JSON.stringify(msg.createdAt)));
                    default: {
                        return interaction.createMessage("test");
                    }
                }
            }

            if(interaction.data.component_type === 2 &&
                    interaction.data.custom_id === "RoleInfoButton") {
                        return interaction.createMessage({
                            flags: 64,
                            embeds: [
                                {
                                    color: discordgrey,
                                    image: {
                                        url: `https://media.discordapp.net/attachments/831909387307319336/1051326858580467792/serverroles.png`
                                    } 
                                },
                                {
                                    color: discordgrey,
                                   description: `**__Ranks__**
                                  \nAs you gain XP in the server (see our FAQ in <#921075369409384448> for more information about XP), you will automatically receive special rank roles:
                                  
                                  \n\n __1,150 XP__    • <@&720343753805660183> – Grants permissions to send images and embedded links as well as to request the <@&413564353829404672> role (see “Requestable Roles” below for details). Also grants access to the <@&388121551779921930> role.
                                  \n__4,675 XP__  • <@&372178560254869504>
                                  \n__11,825 XP__   • <@&372163599130558466> – Grants access to one sub-bending role of your choice, as well as permission to request the <@&830138455337730049> role (see "Requestable Roles" below)
                                  \n__42,000 XP__ • <@&372179082634330112> – Grants permission to request the <@&871374813288083516> role (see “Requestable Roles” below)
                                  \n__101,675 XP__ • <@&372179236842242048> 
                                  \n__200,850 XP__ • <@&423269295930343424> 
                                  \n__349,525 XP__ • <@&434950614997401600> 
                                  \n__557,700 XP__ • <@&811411225639518209> 
                                  \n__835,375 XP__ • <@&811411331621191721> 
                                  \n__1,192,550 XP__ • <@&811411413573697556>`
                                },
                                {
                                    color: discordgrey,
                                   description: `**__Requestable Roles__**
                                   \nThe following roles cannot be self-assigned, but eligible users *who are in good standing with the staff team* may request them by DMing <@718577208687460482> Mod Mail:

                                   \n\n <@&991902499516731494> – Given to members who wish to participate in <#812409753602883626>, our safe space for venting, advice, and comfort from other members. There is no requirement for this role, it's assigned on a case-by-case basis.
                                   
                                   \n\n <@&871374813288083516> – Given to members who want to contribute to our wiki. Grants access to <#869740603557158973>, our channel for discussing anything related to the server's wiki (more info about the wiki can be found above). You must have the <@&372179082634330112> role (42,000 XP) to be eligible for the role; our staff team also reserves the right to remove this role from a user if they go a prolonged period without actively contributing to the wiki.
                                   
                                   \n\n <@&830138455337730049>  – Given to members who want to host events here. Grants access to <#832247862988898334>, our channel where Event Masters organize and coordinate activities for the server. You must have the <@&372163599130558466> role (11,825 XP) to be eligible for the role; our staff team also reserves the right to remove this role from a user if they go a prolonged period without hosting any events.
                                   
                                   \n\n<@&413564353829404672> – Anyone can use our music bots (<@547905866255433758> and <@483377420494176258>) in the general voice channels (<#372383669727526912> and <#719924386228076576>), but higher control is reserved for users with this role. You must have the <@&720343753805660183> role (1,150 XP) to be eligible for the role.`
                                },
                                {
                                    color: discordgrey,
                                   description: `**__Honorary Roles, Prize Roles, and Other Non-Assignable Roles__**
                                   \n The following roles are not regularly available and can only be obtained under special circumstances:
                                   
                                   \n\n<@&787644908705153024> – A special birthday role given automatically by <@772934946200485938> to users on their birthday (UTC time). You must have your birthday added to your Naga profile for this to work; you can set this up by using the ` + '`n.setbirthday`' +  ` command in <#372087473892884502>.
                                   
                                   \n\n<@&709818677532557343> – A temporary (1-week) role given to the winner(s) of Avatar games that we hold in the server. To get notifications for when such games are held, grab yourself the <@&709837040895656028> role (see “Notification Roles” on our community onboarding page).
                                   
                                   \n\n<@&516790566017564684> – A temporary (1-month) role given to the winner(s) of contest events that we hold in the server. To get notifications for when such events are held, grab yourself the <@&497208797039689749> role (see “Notification Roles” below). After 1 month, this role is removed and replaced with <@&530972685610778635> instead.
                                   
                                   \n\n<@&586128911302131725> – An honorary role given automatically to server boosters. Grants access to <#826851222459514923>, our private chat channel for Team Avatar members.
                                   
                                   \n\n<@&433112551195279360> – A role used to temporarily mute server members who misbehave or break our rules (see <#728364994005303307>), preventing them from typing in our chats. This role is removed automatically once the mute duration has been served. To find your mute reason and duration, check the DM you should have received from <@!424659040170409984> (you need to have your DMs open to receive this).
                                   
                                   \n\n<@&717748188630482946> – A role used to revoke access to <#812409753602883626> and <#388122648854528001> for server members who misuse those channels. This role also prevents users from re-assigning themselves the <@&991902499516731494> and <@&388121551779921930> roles (see “Channel Access Roles” on our community onboarding page).`
                                }
                            ]        
                        })
                    }

            if (interaction.data.component_type === 2 &&
                        interaction.data.custom_id === "ChannelInfoButton") {
                            interaction.createMessage({
                                flags: 64,
                                components: [
                                    {
                                        type: 1, 
                                        components: [
                                        {
                                            type: 2,
                                            label: "Page Two", 
                                            style: 1, 
                                            custom_id: "ChannelInfoButton2"
                                        }
                                   ] }],
                                embeds: [
                                    {
                                        color: discordgrey,
                                        image: {
                                            url: `https://cdn.discordapp.com/attachments/411903716996677639/1051303245957570581/channels2.png`
                                        } 
                                    },
                                    {
                                        color: discordgrey,
                                        description: `<:nation_watertribes:381027860288241665> <:nation_earthkingdom:381027789303709696>**VISITOR'S CENTER**<:nation_firenation:381027816466022400> <:nation_airnomads:381027763882295296> 
                                        <:whitelotus:381027716897439744> <#728364994005303307> - Our server rules. Be sure to read them before participating in the server!
                                        <:whitelotus:381027716897439744> <#1053064927935467530> - The channel you're in now! The important information hub of the server. 
                                        <:whitelotus:381027716897439744> <#1065945888507310191> - Our channel for assigning level-restricted roles (eg. sub-bending)!
                                        <:whitelotus:381027716897439744> <#728296501046149137> - Our partnered Discord servers which you can also join and enjoy!
                                        <:whitelotus:381027716897439744> <#529791576545951744> - Our hall of fame for past contest winners!`
                                    },
                                    { 
                                        color: discordgrey,
                                        description:`<:nation_watertribes:381027860288241665> <:nation_earthkingdom:381027789303709696> **BULLETIN** <:nation_firenation:381027816466022400> <:nation_airnomads:381027763882295296>
                                        <:whitelotus:381027716897439744> <#782411596679872542> – Channel for all minor server changes and updates for channels and features.
                                        <:whitelotus:381027716897439744> <#372088315467399170> – For announcing news, updates and special occasions.
                                        <:whitelotus:381027716897439744> <#831063798873587743> – For announcing community events such as streams, gaming/book/music nights and much more!
                                        <:whitelotus:381027716897439744> <#835240650051944469> – For announcing news related to the Avatar Universe.
                                        <:whitelotus:381027716897439744> <#773478447242674207> – For announcing all server giveaways! Entry requirements will still be limited to certain level roles by <@!380453326216626176>.
                                        <:whitelotus:381027716897439744> <#1007044599287656559> – For announcing Birthdays of our server members! Info on how to sign up in this channel. 
                                        Be sure to give yourself appropriate roles in roles for notifications in all previously listed channels!`
                                    },
                                   {
                                        color: discordgrey,
                                       description: `<:nation_watertribes:381027860288241665> <:nation_earthkingdom:381027789303709696> **GENERAL** <:nation_firenation:381027816466022400> <:nation_airnomads:381027763882295296> 
                                       <:whitelotus:381027716897439744> <#761932923217379338> – Channel for the arrival of new members and for us to greet them!
                                       <:whitelotus:381027716897439744> <#826851222459514923> – A private channel for server boosters.
                                       <:whitelotus:381027716897439744> <#372087095121936385> – Our general chat of the server, off-topic conversations and A:TLA&TLOK talk is allowed.
                                       <:whitelotus:381027716897439744> <#372087205063163907> – Post your memes and other videos and images here. No NSFW/NSFL content and any content that breaks the rules.
                                       <:whitelotus:381027716897439744> <#719848144719970324> – The best jokes and moments go here.`
                                    },
                                    {
                                        color: discordgrey,
                                       description: `<:nation_watertribes:381027860288241665> <:nation_earthkingdom:381027789303709696> **AVATAR** <:nation_firenation:381027816466022400> <:nation_airnomads:381027763882295296>
                                       <:whitelotus:381027716897439744> <#372086844956868618> – The main channel for both ATLA and TLOK Discussions only. Off-topic goes in <#372087095121936385>.
                                       <:whitelotus:381027716897439744> <#721604232532459540> – The secondary channel for mainly discussing The Legend of Korra series, but ATLA talk is also allowed.
                                       <:whitelotus:381027716897439744> <#372087003669331969> – Here you can discuss Avatar related comics, novels, and fan fictions! 
                                       <:whitelotus:381027716897439744> <#498253602788343827> – Discuss the latest weekly topic, as long as it's within the rules!
                                       <:whitelotus:381027716897439744> <#709827097559826553> – Avatar Games channel that opens periodically when a game is hosted. Users with the Avatar Games role will be notified when it's open.
                                       <:whitelotus:381027716897439744> <#372098279615496192> – Posts content directly from our partnered subreddit and the official ATLA YouTube channel.`
                                    }
                                ]})                                
                            }
            if (interaction.data.component_type === 2 &&
                interaction.data.custom_id === "ChannelInfoButton2") {
                    interaction.editParent({
                        flags: 64,
                        components: [
                            {
                                type: 1, 
                                components: [
                                {
                                    type: 2,
                                    label: "Page One", 
                                    style: 1, 
                                    custom_id: "ChannelInfoButton1Edit"
                                },
                           ] }],

                            embeds: [
                            {
                                color: discordgrey,
                               description: `<:nation_watertribes:381027860288241665> <:nation_earthkingdom:381027789303709696> **META** <:nation_firenation:381027816466022400> <:nation_airnomads:381027763882295296> 
                               <:whitelotus:381027716897439744> <#792616452770627594> – Suggestions which you can post in <#372087473892884502> are sent here for us to review.
                               <:whitelotus:381027716897439744> <#824762715952119818> – Channel for potential discussion of suggestions posted in <#792616452770627594> 
                               <:whitelotus:381027716897439744> <#794360973963165716> – Place your emote ideas which you would like to see in the server!
                               <:whitelotus:381027716897439744> <#972950132242939964> – Forum channel for our ongoing gaming events, such as <#972950661186617375>, <#1004666132910841939>, <#1016619223830773771>, and <#972950772545384519>!`
                            },
                            {
                                color: discordgrey,
                               description: `<:nation_watertribes:381027860288241665> <:nation_earthkingdom:381027789303709696> **MISCELLANEOUS** <:nation_firenation:381027816466022400> <:nation_airnomads:381027763882295296> 
                               <:whitelotus:381027716897439744> <#726405096132575322> – For pictures of your pets, food, or any other amazing things you'd like to share.
                               <:whitelotus:381027716897439744> <#372087240270151680> – For all forms of art! Be sure to credit the artist by posting a link to the source. Discussions of these works should be done in <#884990489756045332>! Infringement and theft of intellectual property is forbidden and subject to punishment by rule 7 in <#728364994005303307>.
                               <:whitelotus:381027716897439744> <#884990489756045332> – For discussing art or other creative works posted in <#372087240270151680>!
                               <:whitelotus:381027716897439744> <#487958065690312724> – For discussing sports, music, movies, TV shows, games or books! Be sure to use spoiler tags if something recently released is being discussed! Any announcements regarding gaming offers will be posted and pinned in this channel too! 
                               <:whitelotus:381027716897439744> <#388122648854528001> – Discuss serious/controversial topics, including but not limited to politics and moral issues. To reference an article or similar, post a link for others to read it themselves.
                               <:whitelotus:381027716897439744> <#812409753602883626> – Your personal safe space where you can vent out and/or seek guidance, advice or comfort from others. The community is here to help.
                               <:whitelotus:381027716897439744> <#902485012337799189> – For wholesome content of all forms such as nice things that happened in life, or wholesome things from around Discord!   `
                            },
                            {
                                color: discordgrey,
                               description: `<:nation_watertribes:381027860288241665> <:nation_earthkingdom:381027789303709696> **SATO'S WORKSHOP** <:nation_firenation:381027816466022400> <:nation_airnomads:381027763882295296>
                               <:whitelotus:381027716897439744> <#829563592173027369> – Channel for playing with our <@772934946200485938> multi-purpose bot through various games!
                               <:whitelotus:381027716897439744> <#1004827258210504754> –  Secondary channel for playing with the Naga bot, same as above.
                               <:whitelotus:381027716897439744> <#372087473892884502> – The standard channel for sending bot commands, including suggestions for the <#792616452770627594> channel.
                               <:whitelotus:381027716897439744> <#418988592740958208> – The Trivia Rumble channel for playing Trivia games with our custom <@631650441477750808> trivia bot!`
                            },
                            {
                                color: discordgrey,
                               description: `<:nation_watertribes:381027860288241665> <:nation_earthkingdom:381027789303709696> **VOICE CHANNELS** <:nation_firenation:381027816466022400> <:nation_airnomads:381027763882295296>
                               <:whitelotus:381027716897439744> <#372383669727526912> – The channel when using the Beach Cave VC for typing music commands or just for texting.
                               <:whitelotus:381027716897439744> <#719924386228076576>  – The channel when using the Black Cliffs VC for typing music commands or just for texting.
                               <:whitelotus:381027716897439744> <#456158655650201611> – Channel for talking about an ongoing stream happening in the Movers Club Voice chat.
                               <:whitelotus:381027716897439744> <#836266701489831967> – For chatting when using the Ember Island Theatre Stage channel.
                               `
                            }                 
                        ]
                    })
                }                               

                if (interaction.data.component_type === 2 &&
                    interaction.data.custom_id === "ChannelInfoButton1Edit") {
                        interaction.editParent({
                            flags: 64,
                            components: [
                                {
                                    type: 1, 
                                    components: [
                                    {
                                        type: 2,
                                        label: "Page Two", 
                                        style: 1, 
                                        custom_id: "ChannelInfoButton2"
                                    }
                               ] }],
                            embeds: [
                                {
                                    color: discordgrey,
                                    image: {
                                        url: `https://cdn.discordapp.com/attachments/411903716996677639/1051303245957570581/channels2.png`
                                    } 
                                },
                                {
                                    color: discordgrey,
                                    description: `<:nation_watertribes:381027860288241665> <:nation_earthkingdom:381027789303709696>**VISITOR'S CENTER**<:nation_firenation:381027816466022400> <:nation_airnomads:381027763882295296> 
                                    <:whitelotus:381027716897439744> <#728364994005303307> - Our server rules. Be sure to read them before participating in the server!
                                    <:whitelotus:381027716897439744> <#1053064927935467530> - The channel you're in now! The important information hub of the server. 
                                    <:whitelotus:381027716897439744> <#1065945888507310191> - Our channel for assigning level-restricted roles (eg. sub-bending)!
                                    <:whitelotus:381027716897439744> <#728296501046149137> - Our partnered Discord servers which you can also join and enjoy!
                                    <:whitelotus:381027716897439744> <#529791576545951744> - Our hall of fame for past contest winners!`
                                },
                                { 
                                    color: discordgrey,
                                    description:`<:nation_watertribes:381027860288241665> <:nation_earthkingdom:381027789303709696> **BULLETIN** <:nation_firenation:381027816466022400> <:nation_airnomads:381027763882295296>
                                    <:whitelotus:381027716897439744> <#782411596679872542> - Channel for all minor server changes and updates for channels and features.
                                    <:whitelotus:381027716897439744> <#372088315467399170> - For announcing news, updates and special occasions.
                                    <:whitelotus:381027716897439744> <#831063798873587743> - For announcing community events such as streams, gaming/book/music nights and much more!
                                    <:whitelotus:381027716897439744> <#835240650051944469> - For announcing news related to the Avatar Universe.
                                    <:whitelotus:381027716897439744> <#773478447242674207> - For announcing all server giveaways! Entry requirements will still be limited to certain level roles by @Dyno.
                                    <:whitelotus:381027716897439744> <#1007044599287656559> - For announcing Birthdays of our server members! Info on how to sign up in this channel. 
                                    Be sure to give yourself appropriate roles in roles for notifications in all previously listed channels!`
                                },
                                {
                                    color: discordgrey,
                                   description: `<:nation_watertribes:381027860288241665> <:nation_earthkingdom:381027789303709696> **GENERAL** <:nation_firenation:381027816466022400> <:nation_airnomads:381027763882295296> 
                                   <:whitelotus:381027716897439744> <#761932923217379338> - Channel for the arrival of new members and for us to greet them!
                                   <:whitelotus:381027716897439744> <#826851222459514923> - A private channel for server boosters.
                                   <:whitelotus:381027716897439744> <#372087095121936385> – Our general chat of the server, off-topic conversations and A:TLA&TLOK talk is allowed.
                                   <:whitelotus:381027716897439744> <#372087205063163907> – Post your memes and other videos and images here. No NSFW/NSFL content and any content that breaks the rules.
                                   <:whitelotus:381027716897439744> <#719848144719970324> – The best jokes and moments go here.`
                                },
                                {
                                    color: discordgrey,
                                   description: `<:nation_watertribes:381027860288241665> <:nation_earthkingdom:381027789303709696> **AVATAR** <:nation_firenation:381027816466022400> <:nation_airnomads:381027763882295296>
                                   <:whitelotus:381027716897439744> <#372086844956868618> – The main channel for both ATLA and TLOK Discussions only. Off-topic goes in <#372087095121936385>.
                                   <:whitelotus:381027716897439744> <#721604232532459540> – The secondary channel for mainly discussing The Legend of Korra series, but ATLA talk is also allowed.
                                   <:whitelotus:381027716897439744> <#372087003669331969> – Here you can discuss Avatar related comics, novels, and fan fictions! 
                                   <:whitelotus:381027716897439744> <#498253602788343827> – Discuss the latest weekly topic, as long as it's within the rules!
                                   <:whitelotus:381027716897439744> <#709827097559826553> - Avatar Games channel that opens periodically when a game is hosted. Users with the Avatar Games role will be notified when it's open.
                                   <:whitelotus:381027716897439744> <#372098279615496192> – Posts content directly from our partnered subreddit and the official ATLA YouTube channel.`
                                }
                            ]})    
                        }
            if(interaction.data.component_type === 2 &&
                            interaction.data.custom_id === "TeamButton") {
                                return interaction.createMessage({
                                    flags: 64,
                                    embeds: [
                                        {
                                            color: discordgrey,
                                            image: {
                                                url: `https://cdn.discordapp.com/attachments/411903716996677639/1051295564601491556/staff2.png`
                                            } 
                                        },
                                        {
                                            color: discordgrey,
                                            description: `The staff members are here to make sure that everyone has a great time, to answer questions related to the server, or if you have trouble figuring out the server and might have questions or suggestions! You can also DM us through our ModMail, <@718577208687460482>, and a staff member will respond to you as soon as possible!`,
                                            
                                        },
                                        {
                                            color: wlcolour,
                                            thumbnail: {
                                                url: `https://cdn.discordapp.com/emojis/889079239146627122.webp?size=160&quality=lossless`
                                            },
                                            title: `White Lotus - Admin`,
                                            description: `TwoDog#0002 (<@123261299864895489>) | [Server Owner]
                                            \njules_zules#8329 (<@737542058138533950>)
                                            \nKratΩs#7871 (<@222634331384840193>)
                                            \nphantom#1843 (<@532290521058508821>)
                                            \nLion#0002 (<@239446756599922688>)`
                                        },
                                        {
                                            color: sentrycolour,
                                            thumbnail: {
                                                url: `https://cdn.discordapp.com/emojis/771008569431949312.webp?size=80&quality=lossless`
                                            },
                                            title: `Sentry - Senior Mod`,
                                            description: `abendstern#3100 (<@681334177928577066>)
                                            \nsoda#0001 (<@254814547326533632>)
                                            \nemmaaa#7581 (<@432156129603354624>)
                                            \nBun :rabbit:#3892 (<@510193587430883328>)
                                            \nKide:snowflake:#3355 (<@231342149847744512>)
                                            \nthunder#0099 (<@380223584578306049>)`
                                        },
                                        {
                                            color: dailicolour, 
                                            thumbnail: {
                                                url: `https://cdn.discordapp.com/attachments/761932330028892194/1051301088386633788/dai_li_tile.png`
                                            },
                                            title: `Dai Li - Mod`, 
                                            description: `Σuhi#1107 (<@416630867209748483>)
                                            \nghost or something#0066 (<@995668136672116746>)
                                            \nsoren#3546 (<@492301935500591124>)
                                            \npwr_mtlbndr#4552 (<@449227153905680386>)`
                                        }
                                    ],
                                })
                            }
        });
        bot.connect(); // Get the bot to connect to Discord
    }
}

module.exports = CommandHandler;