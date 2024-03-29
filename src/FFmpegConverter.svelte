<script lang="ts">
	import ConverterPage from './components/ConverterPage.svelte';
	import Slider from './components/Slider.svelte';
  import FilledButton from './helion/FilledButton.svelte';
  import OutlinedSelectField from './helion/OutlinedSelectField.svelte';
	import { ffmpeg, loadFFmpeg } from "./utilities.js";
	import { onMount } from 'svelte';
	
	export function loadFile(file: File) {
		inputFile = file;
		generatedFile = undefined;
		
		outputMimeType = inputFile.type as keyof typeof allFormats;
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

	$: outputFormatOptions = inputFile?.type.startsWith("video/") ? Object.entries(allFormats) : Object.entries(audioFormats);
</script>

<ConverterPage {inputFile} outputFile={generatedFile}>
	<div>
		Input Format: <code class="bg-surface text-onSurface">{inputFile?.type}</code>
	</div>
	<br />

	<OutlinedSelectField 
		bind:value={outputMimeType} 
		label="Output Format" 
		options={outputFormatOptions.map(([mimeType, extensions])=>({
			value: mimeType,
			label: mimeType + " (" + extensions + ")",
		}))}
	/>

	<br>

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

	<FilledButton onPress={convert} disabled={!!progressText}>Convert</FilledButton>
	
	<br />
	<br />

	{#if progressText}
		<div style="text-align: center;">{progressText}</div>
		<progress value={progress} max="1" style="display: block; width: 100%;"></progress> 
		<small style="display: block; text-align: center;">{(progress * 100).toFixed(2)}%</small>
	{/if}
</ConverterPage>