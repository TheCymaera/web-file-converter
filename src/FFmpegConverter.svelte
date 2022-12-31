<script lang="ts">
	import ConverterPage from './components/ConverterPage.svelte';
	import Slider from './components/Slider.svelte';
	import { ffmpeg, loadFFmpeg } from "./utilities.js";
	import { onMount } from 'svelte';
	
	export function loadFile(file: File) {
		inputFile = file;
		if (inputURL) URL.revokeObjectURL(inputURL);
		inputURL = URL.createObjectURL(inputFile);

		outputMimeType = inputFile.type as keyof typeof allFormats;
		generatedFile = undefined;
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
	
	// output-config
	let outputMimeType: keyof typeof allFormats = "audio/mpeg";
	let outputVideoQuality = 7;
	let outputAudioQuality = 6;

	// generated
	let generatedFile: File|undefined;
	let progressText = "";
	let progress = 0;

	ffmpeg.setProgress(({ ratio }) => {
		progress = ratio;
	});

	onMount(()=>loadFFmpeg()); //pre-load FFmpeg

	async function convert() {
		if (!inputFile) return;
		
		const outputBaseName = inputFile.name.slice(0, inputFile.name.lastIndexOf("."))
		const outputExtension = allFormats[outputMimeType].split(", ")[0]!;
		const outputFileName = outputBaseName + "." + outputExtension;

		const flags = [
			"-q:v", outputVideoQuality.toString(),
			"-q:a", outputAudioQuality.toString(),
		];

		let output: Uint8Array|undefined;
		try {
			progressText = "Loading FFmpeg..."
			progress = 0;
			await loadFFmpeg();

			progressText = "Converting..."

			// create files
			ffmpeg.FS('writeFile', inputFile.name, new Uint8Array(await inputFile.arrayBuffer()));
			await ffmpeg.run('-i', inputFile.name, ...flags, outputFileName);
			output = ffmpeg.FS('readFile', outputFileName);
		} finally {
			// delete files
			try {
				ffmpeg.FS('unlink', inputFile.name);
			} catch {}
			try {
				ffmpeg.FS('unlink', outputFileName);
			} catch {}
		}

		if (!output) {
			progressText = "Failed!";
			return;
		}

		generatedFile = new File([output], outputFileName, { type: outputMimeType });

		progressText = "";
	}
</script>

<ConverterPage {inputFile} outputFile={generatedFile}>
	<div>
		Input Format: <code>{inputFile?.type}</code>
	</div>
	<br />

	<label>
		<div>Output Format</div>
		<select class="helion-outlined-text-field" bind:value={outputMimeType}>
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
		<Slider min={0} max={10} step={.1} bind:value={outputVideoQuality}/>
		<br />
	</label>

	<label>
		<div>Audio Quality <small>(Lossy Compression)</small></div>
		<Slider min={0} max={10} step={.1} bind:value={outputAudioQuality}/>
		<br />
	</label>

	<button class="helion-filled-button" on:click={convert} disabled={!!progressText}>Convert</button>
	
	<br />
	<br />

	{#if progressText}
		<div style="text-align: center;">{progressText}</div>
		<progress value={progress} max="1" style="display: block; width: 100%;"></progress> 
		<small style="display: block; text-align: center;">{(progress * 100).toFixed(2)}%</small>
	{/if}
</ConverterPage>