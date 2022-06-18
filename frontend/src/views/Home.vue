<template>
    <div class="relative py-24 bg-cover bg-top">
        <div class="relative z-10 container mx-auto px-4 pt-4">
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
    </div>
</template>

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