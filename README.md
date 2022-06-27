![](https://nyc3.digitaloceanspaces.com/cerulean/screenshots/2022/06/Screen%20Shot%202022-06-25%20at%2018.59.43.png)

# 🐴 Horseman, the headless CMS

Horseman is a headless CMS thats powered by Cloudflare KV and the Cache API. Using DurableObjects to ensure data indexes are valid and up to date.

## 🔥 Todo / Feature list

- Pub/Sub channels for getting up to date information on your Objects.
- Better documentation

## 🤔 Why?
Horseman was created when I wanted to make a news feed for Wordful. Looking at other offerings, I found them to be lacking

## 🔧 Setting up
What you'll need:
- A machine with Wrangler 2
- A paid Workers subscription ($5 a month, used for the password hashing Worker)
- A setup, working password hashing Worker: (https://github.com/AggressivelyMeows/password-hashing)
- Please read the README to get the Worker setup correctly.

#### Step 1 - Config
Open wrangler.toml and edit the lines described by the comments. Make sure to follow them precicely otherwise Horseman will not work.

#### Step 2 - Publish the Worker
Run `npx wrangler publish` to publish Horseman to your Cloudflare account. Once done, you will neekd to visit `/v1/__meta/init` to start the database. This step is *required* for Horseman to know whats going on.

## ✨ Acknowledgements
Horseman was created by Cerulean, all code (except ./src/tsndr_router.js, from https://www.npmjs.com/package/@tsndr/cloudflare-worker-router, read comments for why) is copyright of Connor Vince.