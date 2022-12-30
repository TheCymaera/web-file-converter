///<reference lib="ESNext"/>
///<reference lib="WebWorker"/>

const global = self as unknown as ServiceWorkerGlobalScope;

const cacheNamespace = "file-converter"
const version = 3;
const cacheName = `${cacheNamespace}-v${version}`;

const staticAssets = [
	"./",
	"./dst/main.css",
	"./dst/main.js",
	"./icon-bg-512.png",
	"./manifest.json",
	"/favicon.png",
	"https://unpkg.com/@ffmpeg/core@%5E0.11.0/dist/ffmpeg-core.js",
	"https://unpkg.com/@ffmpeg/core@%5E0.11.0/dist/ffmpeg-core.wasm",
	"https://unpkg.com/@ffmpeg/core@%5E0.11.0/dist/ffmpeg-core.worker.js"
];

global.addEventListener("install", (event)=>{
	console.log("[SERVICE WORKER]: Installing...");
	event.waitUntil((async ()=>{
		// create cache
		const cache = await caches.open(cacheName);
		await cache.addAll(staticAssets);

		// install complete, activate service worker.
		console.log("[SERVICE WORKER]: Installed Successfully.");
		global.skipWaiting();
	})());
});

global.addEventListener("activate", async (event)=>{
	console.log("[SERVICE WORKER]: Activating...");
	// remove old caches
	const allCaches = await caches.keys();
	for (const name of allCaches) {
		if (name.startsWith(cacheNamespace) && name !== cacheName) {
			caches.delete(name);
		}
	}

	console.log("[SERVICE WORKER]: Activated Successfully.");
	global.clients.claim();
});

global.addEventListener("fetch", function(event) {
	event.respondWith((async ()=>{
		// use cache if available
		const cache = await caches.open(cacheName);
		const response = await cache.match(event.request);
		if (response) return response;
		
		// use network as fallback
		return fetch(event.request);
	})());
});