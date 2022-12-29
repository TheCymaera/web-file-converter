// Use this to get a list of all resources loaded by the page
// for caching in the service worker.
(()=>{
	const resources = ["./"];

	for (const entry of performance.getEntriesByType("resource")) {
		if (entry.name.startsWith(location.href)) {
			resources.push("./" + entry.name.slice(location.href.length));
		} else if (entry.name.startsWith(location.origin)) {
			resources.push(entry.name.slice(location.origin.length));
		} else {
			// ignore blobs
			if (entry.name.startsWith("blob:")) continue;
			resources.push(entry.name);
		}
	}

	resources.sort();

	console.log(JSON.stringify(resources, null, "\t"));
})();