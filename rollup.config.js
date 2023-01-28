// @ts-check
import svelte from 'rollup-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';
import sourcemaps from "rollup-plugin-sourcemaps";
import typescript from "@rollup/plugin-typescript";
import node from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import url from "@rollup/plugin-url";
import scss from 'rollup-plugin-scss';

export default [
	{
		input: 'src/main.ts',
		output: {
			sourcemap: true,
			format: 'es',
			file: 'public/dst/main.js'
		},
		plugins: [
			json(),
			url(),
			svelte({
				preprocess: sveltePreprocess({ sourceMap: true }),
				onwarn: (warning, handler) => {
					const warnings = ["security-anchor-rel-noreferrer", "a11y-label-has-associated-control"];
					if (warnings.includes(warning.code)) return;
					handler(warning);
				}
			}),
			typescript(),
			node(),
			sourcemaps(),
			commonjs(),
			scss({
				fileName: "main.css",
				outputStyle: "compressed",
			}),
			terser(),
		]
	},
	//{
	//	input: "src/service-worker.ww.ts",
	//	plugins: [typescript(), sourcemaps(), node()],
	//	output: {
	//		sourcemap: true,
	//		format: 'iife',
	//		file: 'public/service-worker.ww.js'
	//	}
	//}
];
