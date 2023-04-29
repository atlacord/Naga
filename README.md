# Naga v3 (pre-alpha)

<p align="center">
  <img width="512" height="512" src="http://img.soda.gg/Naga.png">
</p>

Naga is a multi-purpose Discord bot for the Avatar: The Last Airbender community. It is written in TypeScript using the [eris](https://github.com/abalabahaha/eris) library.

## What's new in Naga v3
Naga has been completely rewritten from the ground up, using our own framework, allowing us to further finetune Naga to our needs. In addition, Naga is now written in TypeScript, rather than JavaScript, allowing us to work faster and more efficiently. The command handler is a heavily-modified version of [Dyno-core](https://git.dyno.sh/dyno-core), and the new Logger is inspired by [@ayanaware/logger](https://gitlab.com/ayanaware/logger). Furthermore, it is now much easier to write a dashboard to complement the bot side of Naga.

## Features
Naga has a relatively wide range of features that is constantly growing based on our needs.
- Automatic banner updates
- Automatic member birthday announcements
- Community archives
- Economy
- Moderation
- A variety of fun and engaging commands such as `topic` and `would-you-rather`
- And more!

## Setup Guide
The majority of configurable variables can be found within `src/config/config.ts`. More sensitive variables, such as the bot token, database credentials, etc. need to be stored as environment variables in `.env`.

### Environment Variables
- CLIENT_ID (Bot's client ID)
- TOKEN (Bot token)
- DEFAULT_PREFIX (The default prefix for new servers Naga is added to)
- DEV_PREFIX (Dev prefix (ignores cooldowns, only accessible by developers))
- MONGO_DSN (Connection string for MongoDB)
- REDIS_HOST (IP address for the Redis instance)
- REDIS_USERNAME (Redis username)
- REDIS_PASSWORD (Redis password)

To compile Naga, use `tsc -p tsconfig.json`. To start it, use `node build/Start.js`

[Naga's Trello page](https://trello.com/b/Mx9bdabJ/features-issues)

## Contributions
Any and all contributions to Naga are welcome (if you have access to this readme, you are a contributor!) Feel free to look at Naga's Trello page to view our roadmap, and ask any questions you may have in `#dev_hub`!