let controller = navigator.serviceWorker?.controller ?? undefined;

export class ServiceWorkerLoader {
	onFirstInstall = ()=>{};
	onUpgrade = ()=>{};

	constructor() {
		if (!navigator.serviceWorker) {
			console.warn("ServiceWorkerLoader: Service worker is not supported in this environment.");
			return;
		}
	
		navigator.serviceWorker.oncontrollerchange = ()=>{
			
			const oldController = controller;
			controller = navigator.serviceWorker.controller ?? undefined;
			
			if (controller) {
				if (oldController === undefined) {
				console.log("ServiceWorkerLoader: Service worker installed for the first time.");
					this.onFirstInstall();
				} else {
					console.log("ServiceWorkerLoader: Service worker changed.");
					this.onUpgrade();
				}
			} else {
				console.log("ServiceWorkerLoader: Service worker removed.");
			}
		}
	}

	async register() {
		if (!navigator.serviceWorker) return;
		
		await navigator.serviceWorker.register('./service-worker.ww.js',{scope:"."})
		.then(function() {
			console.log(`Successfully registered service worker at scope: "."`)
		})
		.catch(function(error) {
			console.log(`Failed to register service worker.\n${error}`);
		});
	}
	
	
	async unregister() {
		if (!navigator.serviceWorker) return;
	
		const registrations = await navigator.serviceWorker.getRegistrations();
		const unregisterPromises = registrations.map(registration => registration.unregister());
	
		await Promise.all(unregisterPromises);
		console.log("Uninstalled service worker.")
	}
	
	async deleteAllCaches() {
		const allCaches = await caches.keys();
		const cacheDeletionPromises = allCaches.map(cache => caches.delete(cache));
		
		await Promise.all(cacheDeletionPromises);
		console.log("Cleared cache.")
	}
}

