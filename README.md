# Naga
Naga is a multi-purpose bot created for the Avatar: The Last Airbender Discord community. It is written in JavaScript using the [eris](https://github.com/abalabahaha/eris) library. The framework used is [AxonCore](https://github.com/KhaaZ/axoncore), which is currently abandoned by its original authors. Naga currently uses its own fork of AxonCore located [here](https://github.com/eaobao/axoncore).

## Setup Guide
`configs/config.json` is pre-configured with permissions. The server prefix is stored in our database, but this file is also where you can change the dev and admin prefixes for your dev environment. Another useful value I recommend enabling is "debug mode". When enabled, your bot's status will change to Do Not Disturb, and all commands will become unusable for normal members. This also provides you with more useful logs in your console.

`configs/secret.json` is (currently) where you enter your bot token. You can use the format in secret.json.example as a starting point. Soon, this will change to environment variables.

[Naga's Trello page](https://trello.com/b/Mx9bdabJ/features-issues)
