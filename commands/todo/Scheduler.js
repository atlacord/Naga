const schedule = require("node-schedule");

const schedulers = {}

// TODO more sanity checks for scheduler
function Scheduler(guild_id) {
	let timeRule, timeJob, midnightRule, midnightJob;
	function init(time = "00:00", timezone, timeCommand, midnightCommand) {
		timeRule = new schedule.RecurrenceRule();
		midnightRule = new schedule.RecurrenceRule();
		if (timezone) {
			timeRule.tz = timezone;
			midnightRule.tz = timezone;
		}
		[timeRule.hour, timeRule.minute] = time.split(":").map(part => part * 1);
		timeJob = schedule.scheduleJob(timeRule, (time) => {
			try {
				timeCommand(guild_id, time);
			} catch(e) {
				console.error(guild_id, time, e);
			}
		});
		[midnightRule.hour, midnightRule.minute] = [0, 0];
		midnightJob = schedule.scheduleJob(midnightRule, (time) => {
			try {
				midnightCommand(guild_id, time);
			} catch(e) {
				console.error(guild_id, time, e);
			}
		});
	}
	function setTimezone(timezone) {
		timeRule.tz = timezone;
		timeJob.reschedule(timeRule);
		midnightRule.tz = timezone;
		midnightJob.reschedule(midnightRule);
	}
	function setTime(time = "00:00") {
		[timeRule.hour, timeRule.minute] = time.split(":").map(part => part * 1);
		timeJob.reschedule(timeRule);
	}
	function destroy() {
		timeJob.cancel();
		midnightJob.cancel();
		delete schedulers[guild_id];
	}
	return {
		init,
		setTimezone,
		setTime,
		destroy
	}
}

function getScheduler(guild_id) {
	if (!schedulers[guild_id]) {
		schedulers[guild_id] = Scheduler(guild_id);
	}
	return schedulers[guild_id];
}
getScheduler.schedulers = schedulers;

module.exports = getScheduler;