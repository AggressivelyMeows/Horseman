<template>
	<div class="bg-gray-900 min-h-screen">
		<header class="bg-gray-800 py-5 px-8">
			<div class="container mx-auto text-primary-500 flex flex-row items-center">
				<router-link to="/" class="font-extrabold text-2xl flex flex-row items-center">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 mr-2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
					</svg>

					<div class="flex flex-col justify-start">
						Horseman
						<span class="text-gray-400 text-xs font-medium" style="margin-top: -3px;">
							The headless CMS
						</span>
					</div>
				</router-link>

				<div class="flex flex-col text-[9px] tracking-wider text-gray-400 font-medium ml-4 hidden md:block">
					<p>Reads: {{$api.state.reads}}</p>
					<p>Writes: {{$api.state.writes}}</p>
					<p>Cache hits: {{$api.state.cache_hits}}</p>
				</div>

				<div class="flex-grow"></div>
				<div v-if="!$api.state.user" class="flex flex-col md:flex-row">
					<router-link class="button ~primary @high md:mr-2 text-sm py-1 px-3" to="/signup">
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
