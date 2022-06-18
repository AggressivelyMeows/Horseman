<template>
    <div class="bg-gray-900 min-h-screen">
        <header class="bg-gray-800 px-4 py-5 md:px-0">
            <div class="container mx-auto text-primary-500 flex flex-row items-center">
                <router-link to="/" class="font-extrabold text-2xl flex flex-row items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <div class="flex flex-col justify-start">
                        Horseman <span class="text-gray-400 text-xs font-medium" style="margin-top: -3px;">Walshy approved™</span>
                    </div>
                </router-link>

                <div class="flex flex-col text-xs text-gray-400 ml-4">
                    <p>Reads: {{$api.state.reads}}</p>
                    <p>Writes: {{$api.state.writes}}</p>
                    <p>Cache hits: {{$api.state.cache_hits}}</p>
                </div>

                <div class="flex-grow"></div>
                <div v-if="!$api.state.user">
                    <router-link class="button ~primary @high mr-2 text-sm py-1 px-3" to="/signup">
                        Sign up
                    </router-link>
                    <router-link class="button ~gray bg-gray-900 text-sm text-gray-200 py-1 px-3" to="/login">
                        Login
                    </router-link>
                </div>
                <div v-else>
                    <router-link class="button ~gray bg-gray-900 text-sm text-gray-200 py-1 px-3" to="/dashboard/models">
                        Dashboard
                    </router-link>
                </div>
            </div>
        </header>
        <main :class="`${ false ? '' : 'container mx-auto px-4 pt-4' }`">
            <router-view />
        </main>

        <notifications position="bottom right" classes="notif" />
        
    </div>
</template>
