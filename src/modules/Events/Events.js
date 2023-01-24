module.exports = {
    CheckServer: require('./Misc/CheckServer'),
    // ContestWinner: require('./RoleHandling/ContestWinner.js'),
    // EnforceBending: require('./RoleHandling/EnforceBending.js'),
    // ExistingTeamAvatar: require('./Misc/ExistingTeamAvatar.js'),
    // Ready: require('.Misc/Ready'),
    // RuleScreening: require('./RoleHandling/RuleScreening.js'),
    // TeamAvatar: require('./Misc/TeamAvatar.js')

    // logs
    MemberJoin: require('./Logs/guildMemberAdd.js'),
    MemberLeave: require('./Logs/guildMemberRemove.js'),
    MessageDelete: require('./Logs/messageDelete.js'),
    MessageUpdate: require('./Logs/messageUpdate.js'),
    VoiceJoin: require('./Logs/voiceChannelJoin.js'),
    VoiceSwitch: require('./Logs/voiceChannelSwitch.js'),
    VoiceLeave: require('./Logs/voiceChannelLeave.js'),

    // Misc
    WelcomeMessage: require('./Interactions/WelcomeMessage.js')

    // === Role Handling ===
    // ContestWinner: require('./RoleHandling/ContestWinner.js'),
    // EnforceBending: require('./RoleHandling/EnforceBending.js'),
};
