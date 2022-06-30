<template>
	<div class=" py-12 bg-cover bg-top overflow-hidden rounded-md">

		<div class="absolute top-[88px] left-0 w-full h-[200px] bg-gradient-to-b from-primary-500/10 via-transparent to-transparent"></div>

		<div class="relative mx-auto">
			<div class="flex flex-col items-center">
				<div class="flex flex-col items-center justify-center" style="width: 100%; max-width: 600px; aspect-ratio: 1 / 1; /*! margin: auto; */ position: relative;">
					<h1 class="mx-auto" style="font-size: min(8vw, 3em); font-weight: 700; top: calc(50% - 0.8em); margin: auto; z-index: 1; letter-spacing: 0.3em; text-indent: 0.3em; text-align: center; color: rgb(255, 255, 255); pointer-events: none; user-select: none; position: absolute;">
						🐴
						<br/>HORSEMAN
					</h1>

					<canvas :style="{ width: '600px', height: '600px' }" class="mx-auto" ref="el" id="cobe"></canvas>
				</div>
			</div>
		</div>

		<div class="mt-[-8rem] md:mt-[-12rem] sm:mb-[6rem] md:mb-[12rem] z-10 relative">
			<h4 class="text-xl text-center font-bold text-gray-300">
				Headless CMS, everywhere, all at once.
			</h4>
		</div>

		<div class="py-24 px-8 z-20 relative">
			<div class="container mx-auto space-y-4">
				<b class="text-primary-500 text-xl font-bold">What is Horseman, the Headless CMS?</b>
				<h4 class="text-2xl font-bold text-gray-200">
					Dev team's are on a never-ending hamster wheel of new projects and deliveries. Why not make your job easier?<br/>
					<span class="text-gray-500">
						Horseman gives you the tools to manage your content, without needing to write a single line of code. Just start writing and your data is avalible globally within seconds, all thanks to the power of modern web technologies. Backed by Cloudflare Workers™, Horseman is the most powerful and secure way to manage your content.
						<br/><br/>
						Dont settle for less, find out how we can make your experience legendary.
						<span class="text-primary-500">Join Horseman today.</span>
					</span>
				</h4>
			</div>
		</div>

		<div class="py-24 px-8 z-20 relative">
			<div class="container mx-auto space-y-4">
				<b class="text-primary-500 text-xl font-bold">How does Horseman work?</b>
				<h4 class="text-2xl font-bold text-gray-200">
					Around the world, theres 250+ locations where Horseman can exist.<br/>
					<span class="text-gray-500">
						Backed by Cloudflare's Workers and KV, Horseman does not rely on a single location for its storage. Meaning access to Horseman is just as fast globally. Alongside this, we have built a database system ontop of this key-value store, meaning you can store and retrieve data in a way that is easy to manage. With the Caching API, we can ensure that your data is always up to date yet cheap to access.
						<br/><br/>
						The headless CMS thats everywhere all at once.
						<span class="text-primary-500">Join Horseman today.</span>
					</span>
				</h4>
			</div>
		</div>

		<div class="py-24 px-8 z-20 relative">
			<div class="container mx-auto space-y-4">
				<b class="text-primary-500 text-xl font-bold">What about Horseman in action?</b>
				<h4 class="text-2xl font-bold text-gray-200">
					Updates and news<br/>
					<span class="text-gray-500">
						This list is actually powered by Horseman itself!
					</span>
					<a href="https://horseman.ceru.dev/v1/models/horseman-news/objects?key=1uI0jPRNuMgM" target="_blank" class="text-gray-500 underline cursor-pointer">
						Click here to see!
					</a>
				</h4>

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
								<p class="mt-3 text-base text-gray-500 prose prose-sm prose-invert" v-html="article.Content.replaceAll('<p><br></p>', '')">
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
					width: 600 * 2,
					height: 600 * 2,
					phi: 0,
					theta: 0,
					dark: 1,
					diffuse: 1.2,
					mapSamples: 16000,
					mapBrightness: 4,
					baseColor: [0.3, 0.3, 0.3],
					markerColor: [0.85,0.27,0.94],
					glowColor: [0.2, 0.2, 0.2],
					markers: [{"location":[35.6839,139.7744],"size":0.03},{"location":[-6.2146,106.8451],"size":0.03},{"location":[14.6,120.9833],"size":0.03},{"location":[-23.5504,-46.6339],"size":0.03},{"location":[37.56,126.99],"size":0.03},{"location":[19.0758,72.8775],"size":0.03},{"location":[19.4333,-99.1333],"size":0.03},{"location":[55.7558,37.6178],"size":0.03},{"location":[13.75,100.5167],"size":0.03},{"location":[23.7289,90.3944],"size":0.03},{"location":[-34.5997,-58.3819],"size":0.03},{"location":[6.45,3.4],"size":0.03},{"location":[41.01,28.9603],"size":0.03},{"location":[24.86,67.01],"size":0.03},{"location":[10.8167,106.6333],"size":0.03},{"location":[34.1139,-118.4068],"size":0.03},{"location":[-22.9083,-43.1964],"size":0.03},{"location":[13.0825,80.275],"size":0.03},{"location":[31.5497,74.3436],"size":0.03},{"location":[51.5072,-0.03275],"size":0.03},{"location":[48.8566,2.3522],"size":0.03},{"location":[-12.06,-77.0375],"size":0.03},{"location":[-8.8383,13.2344],"size":0.03},{"location":[3.1478,101.6953],"size":0.03},{"location":[41.8373,-87.6862],"size":0.03},{"location":[21.0245,105.8412],"size":0.03},{"location":[-6.8,39.2833],"size":0.03},{"location":[22.3069,114.1831],"size":0.03},{"location":[24.65,46.71],"size":0.03},{"location":[25.7839,-80.2102],"size":0.03},{"location":[33.35,44.4167],"size":0.03},{"location":[40.4167,-3.7167],"size":0.03},{"location":[32.7936,-96.7662],"size":0.03},{"location":[40.0077,-75.1339],"size":0.03},{"location":[-1.2864,36.8172],"size":0.03},{"location":[29.7863,-95.3889],"size":0.03},{"location":[33.7627,-84.4224],"size":0.03},{"location":[43.7417,-79.3733],"size":0.03},{"location":[1.3,103.8],"size":0.03},{"location":[-19.9281,-43.9419],"size":0.03},{"location":[-33.865,151.2094],"size":0.03},{"location":[41.3825,2.1769],"size":0.03},{"location":[42.3188,-71.0846],"size":0.03},{"location":[-37.8136,144.9631],"size":0.03},{"location":[-26.2044,28.0416],"size":0.03},{"location":[33.5992,-7.62],"size":0.03},{"location":[33.5722,-112.0891],"size":0.03},{"location":[21.5428,39.1728],"size":0.03},{"location":[47.6211,-122.3244],"size":0.03},{"location":[52.5167,13.3833],"size":0.03},{"location":[45.5089,-73.5617],"size":0.03},{"location":[42.3834,-83.1024],"size":0.03},{"location":[36.7764,3.0586],"size":0.03},{"location":[32.8312,-117.1225],"size":0.03},{"location":[-15.7939,-47.8828],"size":0.03},{"location":[29.375,47.98],"size":0.03},{"location":[44.9635,-93.2678],"size":0.03},{"location":[50.45,30.5236],"size":0.03},{"location":[14.6099,-90.5252],"size":0.03},{"location":[27.9942,-82.4451],"size":0.03},{"location":[-12.9708,-38.5108],"size":0.03},{"location":[39.7621,-104.8759],"size":0.03},{"location":[41.8931,12.4828],"size":0.03},{"location":[-2.19,-79.8875],"size":0.03},{"location":[25.0478,121.5319],"size":0.03},{"location":[-18.9386,47.5214],"size":0.03},{"location":[6.2447,-75.5748],"size":0.03},{"location":[25.2697,55.3094],"size":0.03},{"location":[41.3,69.2667],"size":0.03},{"location":[-3.7275,-38.5275],"size":0.03},{"location":[-27.4678,153.0281],"size":0.03},{"location":[33.6,130.4167],"size":0.03},{"location":[49.25,-123.1],"size":0.03},{"location":[40.3667,49.8352],"size":0.03},{"location":[-17.8292,31.0522],"size":0.03},{"location":[11.5696,104.921],"size":0.03},{"location":[36.2333,-115.2654],"size":0.03},{"location":[45.5372,-122.65],"size":0.03},{"location":[-31.9522,115.8589],"size":0.03},{"location":[38.6358,-90.2451],"size":0.03},{"location":[-0.22,-78.5125],"size":0.03},{"location":[53.9022,27.5618],"size":0.03},{"location":[43.25,76.9],"size":0.03},{"location":[48.2083,16.3725],"size":0.03},{"location":[38.5667,-121.4683],"size":0.03},{"location":[44.4,26.0833],"size":0.03},{"location":[-25.4297,-49.2719],"size":0.03},{"location":[53.55,10],"size":0.03},{"location":[-3.1,-60.0167],"size":0.03},{"location":[37.3019,-121.8486],"size":0.03},{"location":[52.23,21.0111],"size":0.03},{"location":[50.8353,4.3314],"size":0.03},{"location":[47.4983,19.0408],"size":0.03},{"location":[40.4396,-79.9762],"size":0.03},{"location":[25.61,85.1414],"size":0.03},{"location":[39.1239,-94.5541],"size":0.03},{"location":[39.7771,-86.1458],"size":0.03},{"location":[39.9862,-82.985],"size":0.03},{"location":[35.208,-80.8304],"size":0.03},{"location":[-1.4558,-48.5039],"size":0.03},{"location":[48.1375,11.575],"size":0.03},{"location":[-30.0328,-51.23],"size":0.03},{"location":[23.6139,58.5922],"size":0.03},{"location":[47.9214,106.9055],"size":0.03},{"location":[-16.6806,-49.2564],"size":0.03},{"location":[44.8167,20.4667],"size":0.03},{"location":[45.4669,9.19],"size":0.03},{"location":[-36.85,174.7833],"size":0.03},{"location":[50.0833,14.4167],"size":0.03},{"location":[42.6979,23.3217],"size":0.03},{"location":[51.05,-114.0667],"size":0.03},{"location":[21.9831,96.0844],"size":0.03},{"location":[-4.05,39.6667],"size":0.03},{"location":[-25.9153,32.5764],"size":0.03},{"location":[25.3,51.5333],"size":0.03},{"location":[30.3322,-81.6749],"size":0.03},{"location":[-22.9009,-47.0573],"size":0.03},{"location":[14.7319,-17.4572],"size":0.03},{"location":[-1.9536,30.0606],"size":0.03},{"location":[14.0942,-87.2067],"size":0.03},{"location":[41.7225,44.7925],"size":0.03},{"location":[40.7777,-111.9306],"size":0.03},{"location":[55.6805,12.5615],"size":0.03},{"location":[56.0089,92.8719],"size":0.03},{"location":[36.1715,-86.7843],"size":0.03},{"location":[40.03814,44.5144],"size":0.03},{"location":[37.5295,-77.4756],"size":0.03},{"location":[35.1046,-89.9773],"size":0.03},{"location":[36.8008,10.038],"size":0.03},{"location":[27.7167,85.3667],"size":0.03},{"location":[6.3106,-10.8047],"size":0.03},{"location":[18.5425,-72.3386],"size":0.03},{"location":[33.6989,73.0369],"size":0.03},{"location":[45.4247,-75.695],"size":0.03},{"location":[59.3294,18.0686],"size":0.03},{"location":[17.9667,102.6],"size":0.03},{"location":[9,-79.5],"size":0.03},{"location":[52.3667,4.8833],"size":0.03},{"location":[45.8131,15.9772],"size":0.03},{"location":[6.9167,79.8333],"size":0.03},{"location":[49.8844,-97.1464],"size":0.03},{"location":[59.9111,10.7528],"size":0.03},{"location":[37.9842,23.7281],"size":0.03},{"location":[60.03756,24.9342],"size":0.03},{"location":[56.9475,24.1069],"size":0.03},{"location":[54.6833,25.2833],"size":0.03},{"location":[11.595,43.1481],"size":0.03},{"location":[53.3497,-6.2603],"size":0.03},{"location":[38.708,-9.139],"size":0.03},{"location":[59.4372,24.745],"size":0.03},{"location":[33.8869,35.5131],"size":0.03},{"location":[-33.925,18.425],"size":0.03},{"location":[-35.2931,149.1269],"size":0.03},{"location":[35.1725,33.365],"size":0.03},{"location":[9.9333,-84.0833],"size":0.03},{"location":[28.6139,77.209],"size":0.03},{"location":[5.8667,-55.1667],"size":0.03},{"location":[4.175,73.5083],"size":0.03},{"location":[26.225,50.5775],"size":0.03},{"location":[-20.03667,57.5],"size":0.03},{"location":[12.108,-68.935],"size":0.03},{"location":[64.1475,-21.935],"size":0.03},{"location":[27.4833,89.6333],"size":0.03},{"location":[4.9167,114.9167],"size":0.03},{"location":[42.9016,-78.8487],"size":0.03},{"location":[43.2964,5.37],"size":0.03},{"location":[41.2627,-96.0522],"size":0.03},{"location":[36.1911,44.0094],"size":0.03},{"location":[20.2644,85.8281],"size":0.03},{"location":[21.3294,-157.846],"size":0.03},{"location":[26.2273,-98.2471],"size":0.03},{"location":[2.8883,-75.4339],"size":0.03},{"location":[50.03136,8.6797],"size":0.03},{"location":[22.203,113.545],"size":0.03},{"location":[38.1111,13.3517],"size":0.03},{"location":[51.2311,6.7724],"size":0.03},{"location":[-23.5019,-47.4578],"size":0.03},{"location":[48.4833,135.0667],"size":0.03},{"location":[57.6717,11.981],"size":0.03},{"location":[-18.9189,-48.2769],"size":0.03},{"location":[-29.8583,31.025],"size":0.03},{"location":[53.4794,-2.2453],"size":0.03},{"location":[1.4556,103.7611],"size":0.03},{"location":[55.953,-3.189],"size":0.03},{"location":[-27.5933,-48.553],"size":0.03},{"location":[10.03333,-64.6833],"size":0.03},{"location":[47.3744,8.5411],"size":0.03},{"location":[-7.8014,110.3644],"size":0.03},{"location":[42.9836,-81.2497],"size":0.03},{"location":[-26.9189,-49.0658],"size":0.03},{"location":[26.2122,127.6789],"size":0.03},{"location":[-33.0458,-71.6197],"size":0.03},{"location":[32.8,34.9833],"size":0.03},{"location":[40.7245,-74.1725],"size":0.03},{"location":[27.7931,-82.6652],"size":0.03},{"location":[32.51,-84.8771],"size":0.03},{"location":[30.4551,-84.2526],"size":0.03},{"location":[32.3473,-86.2666],"size":0.03},{"location":[-7.2128,-39.315],"size":0.03},{"location":[52.1333,-106.6833],"size":0.03},{"location":[36.8945,-76.259],"size":0.03},{"location":[46.2,6.15],"size":0.03},{"location":[-25.2919,-49.2239],"size":0.03},{"location":[51.9,-8.4731],"size":0.03},{"location":[43.6773,-70.2715],"size":0.03},{"location":[-18.4784,-70.3211],"size":0.03},{"location":[49.1667,-123.1333],"size":0.03},{"location":[10.2558,-67.9539],"size":0.03},{"location":[45.6366,-122.5967],"size":0.03},{"location":[-26.9078,-48.6619],"size":0.03},{"location":[42.9848,-71.4447],"size":0.03},{"location":[12.3528,121.0676],"size":0.03},{"location":[39.1234,-94.7443],"size":0.03},{"location":[15.7833,121],"size":0.03},{"location":[33.9508,-83.3689],"size":0.03},{"location":[30.03995,-85.6004],"size":0.03},{"location":[18.7889,98.9833],"size":0.03},{"location":[9.1397,99.3306],"size":0.03},{"location":[4.7306,-74.2639],"size":0.03},{"location":[37.9477,-122.339],"size":0.03},{"location":[34.7288,-77.3941],"size":0.03},{"location":[10.75,121.95],"size":0.03},{"location":[-34.3333,-56.7167],"size":0.03},{"location":[22.7667,-103.5667],"size":0.03},{"location":[-41.3333,173.1833],"size":0.03},{"location":[40.875,-74.0293],"size":0.03},{"location":[10.038,125.5683],"size":0.03},{"location":[28.1085,-80.6627],"size":0.03},{"location":[13.8772,121.105],"size":0.03},{"location":[40.0705,-82.4251],"size":0.03},{"location":[-26.775,-51.015],"size":0.03},{"location":[40.741,-84.1121],"size":0.03},{"location":[37.7161,-121.8963],"size":0.03},{"location":[34.2661,-85.1862],"size":0.03},{"location":[39.2093,-85.9183],"size":0.03},{"location":[42.7394,-78.8581],"size":0.03},{"location":[41.7753,-72.5242],"size":0.03},{"location":[39.03,-77.4711],"size":0.03},{"location":[37.5204,-122.0312],"size":0.03},{"location":[40.03112,-83.1454],"size":0.03},{"location":[56.397,-3.437],"size":0.03},{"location":[20.2094,-75.2231],"size":0.03},{"location":[13.7,123.5167],"size":0.03},{"location":[39.9651,-74.3738],"size":0.03},{"location":[39.8318,-84.8905],"size":0.03},{"location":[37.7306,-84.2926],"size":0.03},{"location":[37.1175,-84.0767],"size":0.03},{"location":[34.165,-117.9921],"size":0.03},{"location":[3.0164,-76.6411],"size":0.03},{"location":[41.2448,-85.8464],"size":0.03},{"location":[39.6776,-75.7573],"size":0.03},{"location":[43.226,-75.4909],"size":0.03},{"location":[37.1,-8.6667],"size":0.03},{"location":[34.7847,-86.951],"size":0.03},{"location":[33.5088,-88.4096],"size":0.03},{"location":[9.1985,-83.2816],"size":0.03},{"location":[39.3269,-82.0988],"size":0.03},{"location":[-5.115,-36.6339],"size":0.03},{"location":[42.8644,-76.9827],"size":0.03},{"location":[34.8807,-92.1302],"size":0.03},{"location":[10.0083,125.5889],"size":0.03},{"location":[42.0327,-97.4208],"size":0.03},{"location":[46.7307,-116.9986],"size":0.03},{"location":[40.2411,-75.2319],"size":0.03},{"location":[33.6688,-95.546],"size":0.03},{"location":[1.6967,-78.2453],"size":0.03},{"location":[-21.2278,-50.8678],"size":0.03},{"location":[-19.865,-47.44],"size":0.03},{"location":[41.5399,-74.2073],"size":0.03},{"location":[1.4739,-77.0808],"size":0.03},{"location":[41.4368,-97.3563],"size":0.03},{"location":[40.426,-74.6791],"size":0.03},{"location":[9.4167,123.2333],"size":0.03},{"location":[51.456,-0.301],"size":0.03},{"location":[-33.3167,-71.4167],"size":0.03},{"location":[41.8832,-88.3242],"size":0.03},{"location":[39.7292,-90.2318],"size":0.03},{"location":[12.8667,124.1333],"size":0.03},{"location":[42.942,-74.1907],"size":0.03},{"location":[32.5359,-82.928],"size":0.03},{"location":[41.6114,-72.7758],"size":0.03},{"location":[-22.1508,-42.9239],"size":0.03},{"location":[41.3532,-88.8306],"size":0.03},{"location":[41.7237,-88.3631],"size":0.03},{"location":[12.531,124.487],"size":0.03},{"location":[38.583,-90.5065],"size":0.03},{"location":[44.9222,-123.3131],"size":0.03},{"location":[45.7796,-111.1751],"size":0.03},{"location":[-6.7469,-35.5189],"size":0.03},{"location":[27.8911,-97.3284],"size":0.03},{"location":[45.1796,-93.8644],"size":0.03},{"location":[9.2667,125.9667],"size":0.03},{"location":[35.4573,-84.6045],"size":0.03},{"location":[38.8996,-77.2597],"size":0.03},{"location":[36.8877,-94.8718],"size":0.03},{"location":[39.8936,-83.4376],"size":0.03},{"location":[31.9642,-95.2617],"size":0.03},{"location":[35.6011,-105.2206],"size":0.03},{"location":[7.8667,126.3667],"size":0.03},{"location":[33.9153,-84.8416],"size":0.03},{"location":[37.75,14.4],"size":0.03},{"location":[43.0418,-77.093],"size":0.03},{"location":[36.5883,-86.5194],"size":0.03},{"location":[32.2041,-95.8321],"size":0.03},{"location":[42.5662,-84.8304],"size":0.03},{"location":[-7.7258,-35.3269],"size":0.03},{"location":[29.5825,-95.7602],"size":0.03},{"location":[33.8088,-85.7545],"size":0.03},{"location":[38.2016,-84.2719],"size":0.03},{"location":[35.463,-86.0774],"size":0.03},{"location":[38.6,-95.2642],"size":0.03},{"location":[42.1163,-71.3295],"size":0.03},{"location":[44.4869,-71.2599],"size":0.03},{"location":[37.4902,-77.5396],"size":0.03},{"location":[39.2496,-84.3457],"size":0.03},{"location":[36.2934,-88.3065],"size":0.03},{"location":[39.324,-81.5383],"size":0.03},{"location":[-38.3333,141.6],"size":0.03},{"location":[27.5435,-82.5607],"size":0.03},{"location":[41.5988,-72.589],"size":0.03},{"location":[42.9921,-77.1897],"size":0.03},{"location":[41.3604,-75.9662],"size":0.03},{"location":[44.0265,-70.09],"size":0.03},{"location":[39.6149,-87.6904],"size":0.03},{"location":[42.6528,-78.7555],"size":0.03},{"location":[42.0816,-83.6853],"size":0.03},{"location":[14.7833,-89.7833],"size":0.03},{"location":[41.4983,-71.6608],"size":0.03},{"location":[35.9126,-88.7554],"size":0.03},{"location":[39.7915,-74.9375],"size":0.03},{"location":[32.7761,-89.1221],"size":0.03},{"location":[41.8006,-80.9461],"size":0.03},{"location":[40.706,-79.7387],"size":0.03},{"location":[43.4082,-84.6118],"size":0.03},{"location":[55.867,-4.5521],"size":0.03},{"location":[43.3354,-89.03],"size":0.03},{"location":[42.8094,-82.7518],"size":0.03},{"location":[39.7717,-77.8979],"size":0.03},{"location":[-33.5983,150.7511],"size":0.03},{"location":[41.1709,-76.874],"size":0.03},{"location":[40.4375,-84.9833],"size":0.03},{"location":[44.9,-76.25],"size":0.03},{"location":[47.5519,-122.5517],"size":0.03},{"location":[39.2755,-93.9731],"size":0.03},{"location":[43.0802,-77.8753],"size":0.03},{"location":[35.9692,-77.9555],"size":0.03},{"location":[33.1136,-94.1672],"size":0.03},{"location":[39.4313,-121.5225],"size":0.03},{"location":[43.9704,-88.9505],"size":0.03},{"location":[43.2344,-75.7777],"size":0.03},{"location":[40.7752,-80.7628],"size":0.03},{"location":[39.6584,-76.8881],"size":0.03},{"location":[41.0203,-84.0354],"size":0.03},{"location":[44.2445,-70.4883],"size":0.03},{"location":[42.8696,-84.899],"size":0.03},{"location":[-20.7305,143.1425],"size":0.03}],
					onRender: (state) => {
						// Called on every animation frame.
						// `state` will be an empty object, return updated params.
						state.phi = phi;
						phi += 0.003;
					}
				});

			})

			fetch('https://horseman.ceru.dev/v1/models/horseman-news/objects?key=1uI0jPRNuMgM').then(resp => resp.json()).then(data => {
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