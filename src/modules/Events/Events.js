module.exports = {
    CheckServer: require('./Misc/CheckServer'),

    ExistingTeamAvatar: require('./Misc/ExistingTeamAvatar'),
    Ready: require('./Misc/Ready'),
    RuleScreening: require('./RoleHandling/RuleScreening'),
    TeamAvatar: require('./Misc/TeamAvatar'),

    // === Appa Logs ===
    AddNote: require('./AppaLogs/AddNote'),
    Ban: require('./AppaLogs/Ban'),
    Logwarn: require('./AppaLogs/Logwarn'),
    Mute: require('./AppaLogs/Mute'),
    RemoveNote: require('./AppaLogs/RemoveNote'),
    RoleAdd: require('./AppaLogs/RoleAdd'),
    RoleRemove: require('./AppaLogs/RoleRemove'),
    Unban: require('./AppaLogs/Unban'),
    Warning: require('./AppaLogs/Warning'),

    // === logs ===
    // channelCreate: require('./Logs/channelCreate'),
    // channelDelete: require('./Logs/channelDelete'),
    // channelUpdate: require('./Logs/channelUpdate'),

    // guildMemberAdd: require('./Logs/guildMemberAdd'),
    // guildMemberRemove: require('./Logs/guildMemberRemove'),

    // messageDelete: require('./Logs/messageDelete'),
    // messageUpdate: require('./Logs/messageUpdate'),

    // guildRoleCreate: require('./Logs/guildRoleCreate'),
    // guildRoleDelete: require('./Logs/guildRoleDelete'),

    // threadCreate: require('./Logs/threadCreate'),
    // threadDelete: require('./Logs/threadDelete'),
    // threadUpdate: require('./Logs/threadUpdate'),

    // voiceChannelJoin: require('./Logs/voiceChannelJoin'),
    // voiceChannelSwitch: require('./Logs/voiceChannelSwitch'),
    // voiceChannelLeave: require('./Logs/voiceChannelLeave'),

    // === Misc ===
    FakeBan: require('./Misc/FakeBan'),
    LevelUp: require('./Misc/LevelUp'),
    UpdateScore: require('./Misc/UpdateScore'),
    WelcomeMessage: require('./Interactions/WelcomeMessage'),

    // === Role Handling ===
    ContestWinner: require('./RoleHandling/ContestWinner'),
    EnforceBending: require('./RoleHandling/EnforceBending'),
};
