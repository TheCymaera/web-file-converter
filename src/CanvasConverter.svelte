<script lang="ts">
	import MediaDisplay from "./components/SideBySideDisplay.svelte";
	import Slider from "./components/Slider.svelte";
	import { saveURL } from "./utilities.js";

	const imageFormats = {
		"image/png": "png",
		"image/jpeg": "jpg",
		//"image/gif": "gif",
		"image/webp": "webp",
		//"image/bmp": "bmp",
	};

	let src = "";

	export let file: File;

	let originalImage: HTMLImageElement;
	
	let outputMimeType = "image/png";
	let generatedOutputMimeType = outputMimeType;
	let outputQuality = 1;
	let width: number = 0;
	let height: number = 0;

	let outputURL = "";

	$: {
		if (src) URL.revokeObjectURL(src);
		src = URL.createObjectURL(file);
	}

	function onLoad(this: HTMLImageElement) {
		width = this.naturalWidth;
		height = this.naturalHeight;
	}

	function convert() {
		const canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;

		const ctx = canvas.getContext("2d")!;
		ctx.drawImage(originalImage, 0, 0, width, height);

		outputURL = canvas.toDataURL(outputMimeType, outputQuality);
		generatedOutputMimeType = outputMimeType;
	}

	function saveFile() {
		const extension = imageFormats[generatedOutputMimeType].split(",")[0];
		const fileName = file.name.slice(0, file.name.lastIndexOf("."));
		saveURL(outputURL, fileName + "." + extension);
	}
</script>

<div class="ImageConverter">
	<MediaDisplay saveFile={saveFile} showOutput={!!outputURL}>
		<img slot=input src={src} alt="Original" bind:this={originalImage} on:load={onLoad} />
		<img slot=output src={outputURL} alt="Converted">
	</MediaDisplay>

	<panel->
		<div>
			Input Format: <code>{file.type}</code>
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
			<input type="number" class="outlined-text-field" bind:value={width}>
		</label>
	
		<br />

		<label>
			<div>Output Height</div>
			<input type="number" class="outlined-text-field" bind:value={height}>
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

	img {
		display: block;
    width: 100%;
		object-fit: contain;
	}

	panel- {
		padding: .5em;
		overflow: auto;
	}
</style>