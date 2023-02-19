import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
	base: "./",
	build: {
		modulePreload: {
			polyfill: false,
		}
	},
	plugins: [
		svelte(),
	],
});