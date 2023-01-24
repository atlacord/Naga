module.exports = {
    CheckServer: require('./Misc/CheckServer'),

    ExistingTeamAvatar: require('./Misc/ExistingTeamAvatar.js'),
    // Ready: require('.Misc/Ready'),
    RuleScreening: require('./RoleHandling/RuleScreening.js'),
    TeamAvatar: require('./Misc/TeamAvatar.js'),

    // === Appa Logs ===
    // AddNote: require('./AppaLogs/AddNote.js'),
    // Ban: require('./AppaLogs/Ban.js'),
    // Mute: require('./AppaLogs/Mute.js'),
    // RemoveNote: require('./AppaLogs/RemoveNote.js'),
    // Unban: require('./AppaLogs/Unban.js'),

    // === logs ===
    // MemberJoin: require('./Logs/guildMemberAdd.js'),
    // MemberLeave: require('./Logs/guildMemberRemove.js'),
    // MessageDelete: require('./Logs/messageDelete.js'),
    // MessageUpdate: require('./Logs/messageUpdate.js'),
    // VoiceJoin: require('./Logs/voiceChannelJoin.js'),
    // VoiceSwitch: require('./Logs/voiceChannelSwitch.js'),
    // VoiceLeave: require('./Logs/voiceChannelLeave.js'),

    // === Misc ===
    WelcomeMessage: require('./Interactions/WelcomeMessage.js'),

    // === Role Handling ===
    ContestWinner: require('./RoleHandling/ContestWinner.js'),
    EnforceBending: require('./RoleHandling/EnforceBending.js'),
};
