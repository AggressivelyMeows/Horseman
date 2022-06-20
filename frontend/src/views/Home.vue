<template>
    <div class=" py-24 bg-cover bg-top overflow-hidden">

        <div class="flex flex-row items-center">
            <div class="relative z-10 flex-grow">
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

            <canvas :style="{ width: '45rem', height: '45rem' }" class="hidden md:block absolute right-0 top-[4em] z-[0]" ref="el" id="cobe"></canvas>
        </div>

        <div class="mt-24 z-10 block relative">
            <h4 class="text-primary-500 text-2xl font-extrabold inline">
                Updates & news.
            </h4>
        </div>

        <div class="divide-y-2 divide-gray-200 z-10 relative">
            <div class="mt-2 pt-8 grid gap-16 lg:grid-cols-2 lg:gap-x-5 lg:gap-y-12">
                <div v-for="article in news">
                    <p class="text-sm text-gray-500">
                        <time datetime="2020-03-16">{{new Date(article.metadata.created_at).toLocaleDateString()}}</time>
                    </p>
                    <a class="mt-2 block">
                        <p class="text-xl font-semibold text-gray-200">
                            {{article.Title}}
                        </p>
                        <p class="mt-3 text-base text-gray-500" v-html="$api.marked.parse(article.Content.substring(0, 150) + '...')">
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
    import createGlobe from 'cobe';

    export default {
        data: () => ({
            news: [],
            phi: 0,
        }),
        mounted() {
            this.$nextTick(() => {
                let canvas = document.getElementById("cobe");
                let phi = 0;

                const globe = createGlobe(canvas, {
                    devicePixelRatio: 2,
                    width: 720 * 2,
                    height: 720 * 2,
                    phi: 0,
                    theta: 0,
                    dark: 1,
                    diffuse: 1.2,
                    mapSamples: 16000,
                    mapBrightness: 4,
                    baseColor: [0.3, 0.3, 0.3],
                    markerColor: [0.1, 0.8, 1],
                    glowColor: [0.2, 0.2, 0.2],
                    markers: [
                    ],
                    onRender: (state) => {
                        // Called on every animation frame.
                        // `state` will be an empty object, return updated params.
                        state.phi = phi;
                        phi += 0.001;
                    }
                });

            })

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