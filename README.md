![](https://nyc3.digitaloceanspaces.com/cerulean/screenshots/2022/06/Screen%20Shot%202022-06-25%20at%2018.59.43.png)

# Horseman, the headless CMS

Horseman is a headless CMS thats powered by Cloudflare KV and the Cache API. Using DurableObjects to ensure data indexes are valid and up to date.

## Why?
Horseman was created when I wanted to make a news feed for Wordful

## Initalization of Horseman
Before you can create accounts and use Horseman, you need to visit your Workers URL and `/v1/__meta/init`. This creates all the schemas for Horseman to function.

##  Acknowledgements
Horseman was created by Cerulean, all code (except ./lib/tsndr_router.js) is copyright of Connor Vince.