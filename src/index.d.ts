import * as eris from 'eris';

declare module Naga {
    export interface NagaConfig {
        name: string;
        author: string;
        developers: string[];
        version: string;
        prefix: string;
        devPrefix: string;
        logLevel?: string;
        client: {
            id: string;
            token: string;
            secret: string;
            status: string;
            disableEveryone: boolean;
            getAllUsers: boolean;
            messageLimit: number;
            intents: string[]; 
        },
        database: {
            dsn: string;
        },
        emojis: {
            success: string;
            error: string;
            info: string;
        },
    
        avatarGuild: string;
        testGuilds: string[];
        modules: string[];
        pkg: any;
        
        paths: {[key: string]: string};
    }

    export interface ClientConfig {
        id: string;
        secret: string;
        token: string;
        userid: string;
        status: string;
        fetchAllUsers: boolean;
        disableEveryone: boolean;
        allowedMentions: {[key: string]: boolean};
        messageLimit: number;
    }
}

export = Naga;