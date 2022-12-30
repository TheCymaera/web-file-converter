<script lang="ts">
	import MediaDisplay from './components/SideBySideDisplay.svelte';
	import AudioOrVideo from './components/AudioOrVideo.svelte';
	import Slider from './components/Slider.svelte';
	import { ffmpeg, loadFFmpeg, saveURL } from "./utilities.js";
    import { onMount } from 'svelte';
	
	export function loadFile(file: File) {
		inputFile = file;
		if (inputURL) URL.revokeObjectURL(inputURL);
		inputURL = URL.createObjectURL(inputFile);

		outputMimeType = inputFile.type as keyof typeof allFormats;
		generatedURL = "";
	}

	const videoFormats = {
		"video/mp4": "mp4",
		"video/quicktime": "mov, qt",
		"video/ogg": "ogg",
		"video/webm": "webm",
		"video/x-matroska": "mkv",
	}

	const audioFormats = {
		"audio/mpeg": "mp3",
		"audio/ogg": "ogg",
		"audio/wav": "wav",
		"audio/x-m4a": "m4a",
	}

	const allFormats = {
		...videoFormats,
		...audioFormats,
	}

	// input
	let inputFile: File|undefined;
	let inputURL = "";
	
	// config
	let outputMimeType: keyof typeof allFormats = "audio/mpeg";
	let videoQuality = 7;
	let audioQuality = 6;

	// generated
	let generatedURL: string;
	let generatedMimeType: keyof typeof allFormats = outputMimeType;
	let progressText = "";
	let progress = 0;

	ffmpeg.setProgress(({ ratio }) => {
		progress = ratio;
	});

	onMount(()=>loadFFmpeg()); //pre-load FFmpeg

	async function convert() {
		if (!inputFile) return;
		const outputFile = 'output.' + allFormats[outputMimeType].split(", ")[0]!;

		progressText = "Loading FFmpeg..."
		progress = 0;
		await loadFFmpeg();
		
		progressText = "Converting..."
		let output: Uint8Array|undefined;

		const flags = [
			"-q:v", videoQuality.toString(),
			"-q:a", audioQuality.toString(),
		];

		try {
			// create files
			ffmpeg.FS('writeFile', inputFile.name, new Uint8Array(await inputFile.arrayBuffer()));
			await ffmpeg.run('-i', inputFile.name, ...flags, outputFile);
			output = ffmpeg.FS('readFile', outputFile);
		} finally {
			// delete files
			ffmpeg.FS('unlink', inputFile.name);
			ffmpeg.FS('unlink', outputFile);
		}

		if (!output) {
			progressText = "Failed!";
			return;
		}

		const blob = new Blob([output], { type: outputMimeType });

		generatedMimeType = outputMimeType;
		if (generatedURL) URL.revokeObjectURL(generatedURL);
  	generatedURL = URL.createObjectURL(blob);

		progressText = "";
	}
	
	function saveFile() {
		if (!inputFile) return;
		const extension = generatedMimeType.split("/")[1];
		const fileName = inputFile.name.slice(0, inputFile.name.lastIndexOf("."));
		saveURL(generatedURL, fileName + "." + extension);
	}
</script>

<div class="VideoConverter">
	<MediaDisplay showOutput={!!generatedURL} saveFile={saveFile}>
		<AudioOrVideo slot="input" mimeType={inputFile?.type ?? ""} src={inputURL}></AudioOrVideo>
		<AudioOrVideo slot="output" mimeType={generatedMimeType} src={generatedURL}></AudioOrVideo>
	</MediaDisplay>

	<panel->
		<div>
			Input Format: <code>{inputFile?.type}</code>
		</div>
		<br />

		<label>
			<div>Output Format</div>
			<select class="outlined-text-field" bind:value={outputMimeType}>
				{#if inputFile?.type.startsWith("video/")}
					<optgroup label="Video">
						{#each Object.entries(videoFormats) as [mimeType, extensions]}
							<option value={mimeType}>{mimeType} <small>({extensions})</small></option>
						{/each}
					</optgroup>
				{/if}
				<optgroup label="Audio">
					{#each Object.entries(audioFormats) as [mimeType, extensions]}
						<option value={mimeType}>{mimeType} <small>({extensions})</small></option>
					{/each}
				</optgroup>
			</select>
		</label>
		<br />

		<label style="display: {outputMimeType.startsWith("video/") ? "" : "none"}">
			<div>Video Quality <small>(Lossy Compression)</small></div>
			<Slider min={0} max={10} step={.1} bind:value={videoQuality}/>
			<br />
		</label>

		<label>
			<div>Audio Quality <small>(Lossy Compression)</small></div>
			<Slider min={0} max={10} step={.1} bind:value={audioQuality}/>
			<br />
		</label>

		<button class="filled-button" on:click={convert} disabled={!!progressText}>Convert</button>
		
		<br />
		<br />

		{#if progressText}
			<div style="text-align: center;">{progressText}</div>
			<progress value={progress} max="1" style="display: block; width: 100%;"></progress> 
			<small style="display: block; text-align: center;">{(progress * 100).toFixed(2)}%</small>
		{/if}
	</panel->
</div>

<style>
	.VideoConverter {
		display: grid;
		grid-template-columns: auto 300px;
	}

	/* make the sections appear on top of one another on mobile */
	@media (max-width: 600px) {
		.VideoConverter {
			grid-template-columns: unset;
			grid-template-rows: 1fr 1fr;
		}
	}

	panel- {
		padding: 0.5em;
		overflow: auto;
	}
</style>