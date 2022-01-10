// All Credits to https://github.com/seeeeew/bdaybot/blob/main/index.js for this command

// Requirements
const {GuildConfig, Birthdays} = require("./DataManager");
const Scheduler = require("./Scheduler")





// Birthday Set Function

function bdaySet(message, input) {
	const match = input.match(/^(?:(\d{4})-)?(\d{2})-(\d{2})$/);
	if (!match) return;
	const [, year, month, day] = match;
	const checkstring = `${year || "2000"}-${month}-${day}`;
	try {
		if (new Date(checkstring).toISOString().split("T")[0] !== checkstring) return;
	} catch(e) {
		return;
	}
	Birthdays.setUserBirthday(message.guild.id, message.author.id, day, month, year);
	const datestring = Intl.DateTimeFormat("en-GB", {day: "numeric", month: "long", year: year ? "numeric" : undefined}).format(new Date(checkstring));
message.channel.createEmbed(
                    new Chariot.RichEmbed()
                        .setColor(colour.successColour)
                        .setTitle(`<:twoyes:746133145195118634> Your birthday was set to **${datestring}**`)
                ); 
checkBdayRole(message.guild.id)
}

// Birthday Remove Function

function bdayRemove(message) {
	const changes = Birthdays.removeUserBirthday(message.guild.id, message.author.id);
	if (changes) {
		message.channel.createEmbed(
                            new Chariot.RichEmbed()
                                .setColor(colour.successColour)
                                .setTitle("<:twoyes:746133145195118634> Your birthday was removed.")
                        )
		checkBdayRole(message.guild.id);
	}
}

// Birthday List function

function bdayList(message) {
	const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	const guild_id = message.guild.id;
	const currentyear = new Date(new Date().toLocaleString("en-US", {timeZone: GuildConfig.get(guild_id, "timezone")})).getFullYear();
	const rows = Birthdays.getBirthdays(guild_id);
	message.guild.members.get({user: rows.map(row => row.user_id)}).then(() => {
		const birthdays = rows.map(row => {
			const member = message.guild.member(row.user_id);
			if (member) {
				row.name = member.displayName;
			} else {
				Birthdays.removeUserBirthday(guild_id, row.user_id);
			}
			if (row.year) row.age = currentyear - row.year;
			return row;
		}).filter(row => !!row.name).sort((a, b) => {
			return a.month != b.month ? a.month - b.month : (a.day != b.day ? a.day - b.day : a.name.localeCompare(b.name));
		}).reduce((acc, cv) => {
			(acc[cv.month - 1] = acc[cv.month - 1] || []).push(cv);
			return acc;
		}, []).map(list => list.reduce((acc, cv) => {
			(acc[cv.day] = acc[cv.day] || []).push(cv);
			return acc;
		}, []));
		const fields = months.map((name, i) => {
			let value = "(none)";
			if (birthdays[i] && birthdays[i].length) {
				value = birthdays[i].map((day, i) => i + ": " + day.map(row => `<@!${row.user_id}>` + (row.age ? ` (${row.age})` : "")).join(", ")).filter(entry => !!entry).join("\n");
			}
			return {
				name,
				value,
				inline: true
			}
		});
        const embed = new Chariot.RichEmbed()
            .setTitle("Birthday List")
            .setDescription(`Birthdays for **${message.guild.name}** in **${currentyear}**:`)
		message.channel.createEmbed(embed)
	});
}

// Birthday Next function

function bdayNext(message) {
	const num = 3;
	const guild_id = message.guild.id;
	const currentdate = new Date(new Date().toLocaleString("en-US", {timeZone: GuildConfig.get(guild_id, "timezone")}));
	const [alert_hour, alert_minute] = (GuildConfig.get(guild_id, "alert_time") || "00:00").split(":").map(num => num * 1);
	const currenthour = currentdate.getHours();
	const currentminute = currentdate.getMinutes();
	const currentyear = currentdate.getFullYear();
	const currentmonth = currentdate.getMonth() + 1;
	const currentday = currentdate.getDate() + (currenthour > alert_hour || (currenthour == alert_hour && currentminute > alert_minute));
	const rows = Birthdays.getBirthdays(guild_id);
	message.guild.members.get({user: rows.map(row => row.user_id)}).then(() => {
		let birthdays = rows.map(row => {
			const member = message.guild.member(row.user_id);
			if (member) {
				row.name = member.displayName;
			} else {
				Birthdays.removeUserBirthday(guild_id, row.user_id);
			}
			if (row.year) row.age = currentyear - row.year;
			return row;
		}).filter(row => !!row.name).sort((a, b) => {
			return a.month != b.month ? a.month - b.month : (a.day != b.day ? a.day - b.day : a.name.localeCompare(b.name));
		});
		birthdays = [
			...birthdays.filter(row => row.month > currentmonth || (row.month == currentmonth && row.day >= currentday)),
			...birthdays.filter(row => row.month < currentmonth || (row.month == currentmonth && row.day < currentday)).map(row => {row = {...row}; row.age++; return row;})
		];
		if (birthdays.length > num) {
			birthdays = birthdays.filter((row, index) => index < num ? true : (row.day == birthdays[num - 1].day && row.month == birthdays[num - 1].month));
		}
		const description = !birthdays.length ? "(no birthdays)" : birthdays.map(row => {
			const datestring = Intl.DateTimeFormat("en-GB", {day: "numeric", month: "long"}).format(new Date(`2000-${row.month}-${row.day}`));
			return `<@!${row.user_id}>` + (row.age ? ` (${row.age})` : "") + ` – **${datestring}**`;
		}).join("\n");

		const avatarURL = chariot.user.avatarURL();
        const embed = new Chariot.RichEmbed()
        .setTitle("Upcoming Birthdays")
        .setThumbnail(avatarURL)
        .setDescription(description)
    message.channel.createEmbed(embed)
	});
}

// bdayAlert Function

function bdayAlert(guild_id, user_id, year) {
	const currentyear = new Date(new Date().toLocaleString("en-US", {timeZone: GuildConfig.get(guild_id, "timezone")})).getFullYear();
	const channel_id = GuildConfig.get(guild_id, "alert_channel");
	if (!channel_id) return;
	const guild = chariot.guilds.find(guild => guild.id == guild_id);
	if (!guild) return;
	const channel = guild.channels.find(channel => channel.id == channel_id);
	if (!channel) return;
	const tpl_noage = GuildConfig.get(guild_id, "alert_message") || "Happy birthday, {user}! :partying_face:";
	const tpl_age = GuildConfig.get(guild_id, "alert_message_age") || tpl_noage;
	let message;
	if (year) {
		const age = currentyear - year;
		const ageth = age + (["st", "nd", "rd"][((age + 90) % 100 - 10) % 10 - 1] || "th");
		message = tpl_age.replace("{user}", `<@!${user_id}>`).replace("{age}", age).replace("{ageth}", ageth);
	} else {
		message = tpl_noage.replace("{user}", `<@!${user_id}>`);
	}
	if (GuildConfig.get(guild_id, "alert_embed") === "true") {
		message.channel.createEmbed(
                new Chariot.RichEmbed()
                .setDescription(message)
            )
	} else {
		channel.createMessage(message);
	}
}


// checkBdayAlert function

function checkBdayAlert(guild_id, time) {
	if (!time) time = new Date(new Date().toLocaleString("en-US", {timeZone: GuildConfig.get(guild_id, "timezone")}));
	const alert_channel = GuildConfig.get(guild_id, "alert_channel");
	if (!alert_channel) return;
	Birthdays.getUsersByBirthday(guild_id, time.getDate(), time.getMonth() + 1).forEach(row => bdayAlert(guild_id, row.user_id, row.year));
}

// checkBdayRole function


function checkBdayRole(guild_id, time) {
	if (!time) time = new Date(new Date().toLocaleString("en-US", {timeZone: GuildConfig.get(guild_id, "timezone")}));
	const day = time.getDate();
	const month = time.getMonth() + 1;
	const role_id = GuildConfig.get(guild_id, "bday_role");
	if (!role_id) return;
	const guild = client.guilds.cache.get(guild_id);
	if (!guild.roles.cache.has(role_id)) return;
	const bdayusers = Birthdays.getUsersByBirthday(guild_id, day, month).map(row => row.user_id);
	guild.members.get().then((members) => {
		members.forEach((member, id) => {
			if (member.roles.has(role_id) && !bdayusers.includes(member.user.id)) {
				member.roles.removeRole(role_id, "Today is not their birthday.");
			} else if (bdayusers.includes(member.user.id) && !member.roles.cache.has(role_id)) {
				member.roles.addRole(role_id, "Today is their birthday.");
			}
		});
	});
}

// updateSchedulers function
function updateSchedulers() {
	Object.keys(Scheduler.schedulers).forEach(guild_id => {
		if (!client.guilds.cache.has(guild_id)) {
			Scheduler(guild_id).destroy();
		}
	});
	[...client.guilds.cache.keys()].forEach(guild_id => {
		if (!Scheduler.schedulers.hasOwnProperty(guild_id) && (!config.guilds || config.guilds.includes(guild_id))) {
			const time = GuildConfig.get(guild_id, "alert_time");
			const timezone = GuildConfig.get(guild_id, "timezone");
			Scheduler(guild_id).init(time, timezone, checkBdayAlert, checkBdayRole);
		}
	});

}

module.exports = {
    bdaySet, 
    bdayRemove, 
    bdayList, 
    bdayNext, 
    bdayAlert, 
    checkBdayAlert, 
    checkBdayRole, 
    updateSchedulers
  };