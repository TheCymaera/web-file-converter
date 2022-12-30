// @ts-check
import svelte from 'rollup-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';
import sourcemaps from "rollup-plugin-sourcemaps";
import typescript from "@rollup/plugin-typescript";
import node from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import wasm from '@rollup/plugin-wasm';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
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
			wasm(),
			json(),
			svelte({
				preprocess: sveltePreprocess({ sourceMap: true }),
				compilerOptions: { }
			}),
			typescript(),
			node(),
			sourcemaps(),
			commonjs(),
			scss({
				fileName: "main.css",
				outputStyle: "compressed",
			}),
			terser({
			}),
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
