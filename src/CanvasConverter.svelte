<script lang="ts">
	import SideBySide from "./components/SideBySideDisplay.svelte";
	import Slider from "./components/Slider.svelte";
	import { saveURL } from "./utilities.js";

	export function loadFile(file: File) {
		if (inputURL) URL.revokeObjectURL(inputURL);
		inputURL = URL.createObjectURL(file);
		inputName = file.name.slice(0, file.name.lastIndexOf("."));
		inputType = file.type;
		
		generatedURL = "";
	}

	function onLoad(this: HTMLImageElement) {
		outputWidth = this.naturalWidth;
		outputHeight = this.naturalHeight;
	}

	const imageFormats = {
		"image/png": "png",
		"image/jpeg": "jpg",
		//"image/gif": "gif",
		"image/webp": "webp",
		//"image/bmp": "bmp",
	};

	// input
	let inputURL = "";
	let inputName = "";
	let inputType = "";
	let inputImage: HTMLImageElement;
	
	// config
	let outputMimeType = "image/png";
	let outputQuality = 1;
	let outputWidth = 0;
	let outputHeight = 0;

	// generated
	let generatedURL = "";
	let generatedOutputMimeType = outputMimeType;

	function convert() {
		const canvas = document.createElement("canvas");
		canvas.width = outputWidth;
		canvas.height = outputHeight;

		const ctx = canvas.getContext("2d")!;
		ctx.drawImage(inputImage, 0, 0, outputWidth, outputHeight);

		generatedURL = canvas.toDataURL(outputMimeType, outputQuality);
		generatedOutputMimeType = outputMimeType;
	}

	function saveFile() {
		const extension = imageFormats[generatedOutputMimeType].split(",")[0];
		const fileName = inputName;
		saveURL(generatedURL, fileName + "." + extension);
	}
</script>

<div class="ImageConverter">
	<SideBySide saveFile={saveFile} showOutput={!!generatedURL}>
		<img slot=input src={inputURL} alt="Original" bind:this={inputImage} on:load={onLoad} />
		<img slot=output src={generatedURL} alt="Converted">
	</SideBySide>

	<panel->
		<div>
			Input Format: <code>{inputType}</code>
		</div>
		<br />

		<label>
			<div>Output Format</div>
			<select class="outlined-text-field" bind:value={outputMimeType}>
				{#each Object.entries(imageFormats) as [mimeType, extensions]}
					<option value={mimeType}>{imageFormats[mimeType]} ({extensions})</option>
				{/each}
			</select>
		</label>

		<br />

		<label>
			<div>Output Width</div>
			<input type="number" class="outlined-text-field" bind:value={outputWidth}>
		</label>
	
		<br />

		<label>
			<div>Output Height</div>
			<input type="number" class="outlined-text-field" bind:value={outputHeight}>
		</label>

		<br />

		<label style="display: {outputMimeType === "image/jpeg" ? "" : "none"}">
			<div>Image Quality <small>(Lossy Compression)</small></div>
			<Slider step={.01} min={0} max={1} bind:value={outputQuality} />
			
			<br />
		</label>

		<button class="filled-button" on:click={convert}>Convert</button>
	</panel->
</div>

<style>
	.ImageConverter {
		display: grid;
		grid-template-columns: auto 300px;
	}

	/* make the sections appear on top of one another on mobile */
	@media (max-width: 600px) {
		.ImageConverter {
			grid-template-columns: unset;
			grid-template-rows: 1fr 1fr;
		}
	}

	panel- {
		padding: .5em;
		overflow: auto;
	}

	img {
		display: block;
		width: 100%;
		object-fit: contain;
	}
</style>