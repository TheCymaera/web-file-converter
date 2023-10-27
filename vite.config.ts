import * as vite from "vite";
import { svelte } from '@sveltejs/vite-plugin-svelte'


export default vite.defineConfig({
	base: "./",
	server: {
		headers: {
			"Cross-Origin-Opener-Policy": "same-origin",
			"Cross-Origin-Embedder-Policy": "require-corp",
		}
	},
	plugins: [
		svelte(),
	],
});