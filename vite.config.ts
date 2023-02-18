import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { createHtmlPlugin } from 'vite-plugin-html';

const page_url = "https://heledron.com/tools/file-converter/"

const page_title					= "File Converter";
const page_description		= "Convert between video and image formats.";
const page_author					= "Morgan";
const page_keywords				= "Heledron, Hadron, Cymaera, File, Converter, MP4, MOV";
const page_og_title 				= page_title;
const page_og_description 	= page_description;
const page_og_url 					= page_url;
const page_og_image 				= page_og_url + "thumbnail.webp";
const page_og_type 					= "website";

export default defineConfig({
	base: "./",
	build: {
		modulePreload: {
			polyfill: false,
		}
	},
	plugins: [
		svelte(),
		createHtmlPlugin({
			minify: true,
			inject: {
				data: {
					page_url,
					page_title,
					page_description,
					page_author,
					page_keywords,
					page_og_title,
					page_og_description,
					page_og_url,
					page_og_image,
					page_og_type,
				}
			}
		}),
	],
});