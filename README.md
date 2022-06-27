![](https://nyc3.digitaloceanspaces.com/cerulean/screenshots/2022/06/Screen%20Shot%202022-06-25%20at%2018.59.43.png)

# 🐴 Horseman, the headless CMS

Horseman is a headless CMS thats powered by Cloudflare KV and the Cache API. Using DurableObjects to ensure data indexes are valid and up to date.

Horseman was created when I wanted to make a news feed for [Wordful](https://wordful.ceru.dev), my multiplayer Wordle game. Looking at other offerings, I wished for something simple, yet quick. After some quick discussions, I realised I could make my own headless CMS by utilising Cloudflare's global KV. This makes Horseman no less than 50ms from anyone around the world.

You can find a public Horseman instance on my website, here: https://horseman.ceru.dev/

API documentation can be found here: https://horseman.stoplight.io/docs/horseman/abe38a2fb9c9d-list-models

## ⚡ Features
- World-wide, high speed, infinitely scalable, all thanks to Cloudflare Workers.
- Modern, sleek UI for creating and managing your Objects.
- Caching API built in, smartly clears cache to ensure your data is always up to date world-wide. Also reduces read costs significantly so you dont have to worry about a sudden burst of requests killing your bill.
- Wildcard searching built-in. Alongside other features such as cursors, Horseman can perform wildcard searching on any indexed field.
    - For example: `?Field=eq.Hello*` would find any Object with `Hello` in `Field`. Wildcards can go anywhere in the string.

## 🔥 Todo

- Pub/Sub channels for getting up to date information on your Objects.
- An "organisation" system to allow people to be assigned to groups modifying the same group of Objects.
- A plugin system to support third-party modifications to the API. For self-hosted users only, however would allow for people to add custom content-based embeds/RSS feeds.
- Ask for more feedback
- Better documentation 📚

*Have an idea? Make a discussion post about it and tell us all about your awesome idea!!*

## 🔧 Setting up
What you'll need:
- A machine with Wrangler 2
- A paid Workers subscription ($5 a month, used for the password hashing Worker)
- A setup, working password hashing Worker: (https://github.com/AggressivelyMeows/password-hashing)
- Please read the README to get the passowrd hashing Worker setup correctly.

#### Step 1 - Config
Open wrangler.toml and edit the lines described by the comments. Make sure to follow them precicely otherwise Horseman will not work.

#### Step 2 - Publish the Worker
Run `npx wrangler publish` to publish Horseman to your Cloudflare account. Once done, you will neekd to visit `/v1/__meta/init` to start the database. This step is *required* for Horseman to know whats going on.

## ✨ Acknowledgements
Horseman was created by Cerulean, all code (except ./src/tsndr_router.js, from https://www.npmjs.com/package/@tsndr/cloudflare-worker-router, read comments for why) is copyright of Connor Vince. Please read the Licence terms before publishing your own Horseman instance.