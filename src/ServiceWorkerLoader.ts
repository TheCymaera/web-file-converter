let controller = navigator.serviceWorker?.controller ?? undefined;

export class ServiceWorkerLoader {
	onFirstController = ()=>{};
	onUpgradeController = ()=>{};

	constructor() {
		if (!navigator.serviceWorker) return;
	
		navigator.serviceWorker.oncontrollerchange = ()=>{
			
			const oldController = controller;
			controller = navigator.serviceWorker.controller ?? undefined;
			
			if (controller) {
				if (oldController === undefined) {
					this.onFirstController();
				} else {
					this.onUpgradeController();
				}
			}
		}
	}

	async register(scriptURL: string | URL, options?: RegistrationOptions): Promise<ServiceWorkerRegistration|undefined> {
		if (!navigator.serviceWorker) throw new Error("Service worker is not supported in this environment");
		
		return navigator.serviceWorker.register(scriptURL, options);
	}
	
	
	async unregister() {
		if (!navigator.serviceWorker) return;
	
		const registrations = await navigator.serviceWorker.getRegistrations();
		const unregisterPromises = registrations.map(registration => registration.unregister());
	
		await Promise.all(unregisterPromises);
	}
	
	async deleteAllCaches() {
		const allCaches = await caches.keys();
		const cacheDeletionPromises = allCaches.map(cache => caches.delete(cache));
		
		await Promise.all(cacheDeletionPromises);
	}
}

