module.exports = {
    CheckServer: require('./Misc/CheckServer'),

    ExistingTeamAvatar: require('./Misc/ExistingTeamAvatar'),
    Ready: require('./Misc/Ready'),
    RuleScreening: require('./RoleHandling/RuleScreening'),
    TeamAvatar: require('./Misc/TeamAvatar'),

    // === Appa / Dyno Logs ===
     AddNote: require('./AppaLogs/AddNote'),
     Ban: require('./AppaLogs/Ban'),
    // Logwarn: require('./AppaLogs/Logwarn'),
    // Mute: require('./AppaLogs/Mute'),
    // RemoveNote: require('./AppaLogs/RemoveNote'),
    // RoleAdd: require('./AppaLogs/RoleAdd'),
    // RoleRemove: require('./AppaLogs/RoleRemove'),
    // Unban: require('./AppaLogs/Unban'),
    // Warning: require('./AppaLogs/Warning'),
    
    // === Interactions ===
    HotlineResources: require('./Interactions/HotlineResources'),
    WelcomeMessage: require('./Interactions/WelcomeMessage'),

    // === Logs ===
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
    // BlurpleCanvas: require('./Misc/BlurpleCanvas'),
    EnforceLakeLaogai: require('./Misc/EnforceLakeLaogai'),
    FakeBan: require('./Misc/FakeBan'),
    // LevelUp: require('./Misc/LevelUp'),
    // UpdateScore: require('./Misc/UpdateScore'),

    // === Role Handling ===
    ContestWinner: require('./RoleHandling/ContestWinner'),
    EnforceBending: require('./RoleHandling/EnforceBending'),
};
