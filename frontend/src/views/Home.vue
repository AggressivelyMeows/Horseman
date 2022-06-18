<template>
    <div class="relative py-24 bg-cover bg-top">
        <div class="relative z-10">
            <h4 class="text-4xl font-extrabold text-gray-600">
                Ok, but what if headless CMS<br/>
                But at the edge?? 🤔
            </h4>
            <h4 class="text-4xl font-extrabold text-primary-500">
                Horseman, the headless CMS.
            </h4>
            <div class="mt-4 text-gray-400 font-medium text-lg">
                <p>
                    Powered by Cloudflare Workers & KV, solely.<br/>Batteries included.
                </p>
            </div>
        </div>
        <div class="mt-24">
            <h4 class="text-primary-500 text-2xl font-extrabold inline">
                Updates & news.
            </h4>
            <h5 class="text-gray-600 text-2xl font-extrabold inline">Powered by Horseman, click <a class="underline" target="_blank" href="https://horseman.ceru.dev/v1/models/news/objects?key=1uI0jPRNuMgM">here</a> to see.</h5>
        </div>

        <div class="divide-y-2 divide-gray-200">
            <div class="mt-2 pt-8 grid gap-16 lg:grid-cols-2 lg:gap-x-5 lg:gap-y-12">
                <div v-for="article in news">
                    <p class="text-sm text-gray-500">
                        <time datetime="2020-03-16">{{new Date(article.metadata.created_at).toLocaleDateString()}}</time>
                    </p>
                    <a class="mt-2 block">
                        <p class="text-xl font-semibold text-gray-200">
                            {{article.Title}}
                        </p>
                        <p class="mt-3 text-base text-gray-500">
                            {{article.Content}}
                        </p>
                    </a>
                    <div class="mt-3">
                        <a href="#" class="text-base font-semibold text-primary-600 hover:text-primary-500">
                            Read full story (coming soon)
                        </a>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        data: () => ({
            news: []
        }),
        mounted() {
            fetch('https://horseman.ceru.dev/v1/models/news/objects?key=1uI0jPRNuMgM').then(resp => resp.json()).then(data => {
                this.news = data.results
            })
        }
    }
</script>

<style scoped>
.vimeo-wrapper {
   position: absolute;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   z-index: 0;
   pointer-events: none;
   overflow: hidden;
}
.vimeo-wrapper iframe {
   width: 100vw;
   height: 56.25vw; /* Given a 16:9 aspect ratio, 9/16*100 = 56.25 */
   min-height: 100vh;
   min-width: 177.77vh; /* Given a 16:9 aspect ratio, 16/9*100 = 177.77 */
   position: absolute;
   top: 50%;
   left: 50%;
   transform: translate(-50%, -50%);
}
</style>