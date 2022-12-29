export function saveURL(url: string, fileName: string) {
	const a = document.createElement('a');
	a.href = url;
	a.download = fileName;
	a.click();
}