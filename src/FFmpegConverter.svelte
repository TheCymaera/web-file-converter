<script lang="ts">
	import * as downloader from './downloader.js';
	import MediaDisplay from './components/SideBySideDisplay.svelte';
	import AudioOrVideo from './components/AudioOrVideo.svelte';
	import Slider from './components/Slider.svelte';
	import { ffmpeg, ffmpegLoaded } from "./ffmpeg.js";

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

	export let file: File;
	let outputMimeType: keyof typeof videoFormats = file.type as keyof typeof videoFormats;
	let generatedOutputMimeType: keyof typeof videoFormats = outputMimeType;
	let outputURL: string;
	let progressText = "";
	let progress = 0;

	let videoQuality = 7;
	let audioQuality = 6;

	let src = "";
	$: {
		if (src) URL.revokeObjectURL(src);
		src = URL.createObjectURL(file);
	}

	ffmpeg.setProgress(({ ratio }) => {
		progress = ratio;
	});

	async function convert() {
		progressText = "Loading FFmpeg..."
		progress = 0;
		await ffmpegLoaded;

		const outputFile = 'output.' + allFormats[outputMimeType].split(", ")[0]!;
		
		progressText = "Converting..."
		let output: Uint8Array|undefined;

		const flags = [
			"-q:v", videoQuality.toString(),
			"-q:a", audioQuality.toString(),
		];

		try {
			// create files
			ffmpeg.FS('writeFile', file.name, new Uint8Array(await file.arrayBuffer()));
			await ffmpeg.run('-i', file.name, ...flags, outputFile);
			output = ffmpeg.FS('readFile', outputFile);
		} finally {
			// delete files
			ffmpeg.FS('unlink', file.name);
			ffmpeg.FS('unlink', outputFile);
		}

		if (!output) {
			progressText = "Failed!";
			return;
		}

		const blob = new Blob([output], { type: outputMimeType });

		generatedOutputMimeType = outputMimeType;
		if (outputURL) URL.revokeObjectURL(outputURL);
  	outputURL = URL.createObjectURL(blob);

		progressText = "";
	}
	
	function saveFile() {
		const extension = generatedOutputMimeType.split("/")[1];
		const fileName = file.name.slice(0, file.name.lastIndexOf("."));
		downloader.saveURL(outputURL, fileName + "." + extension);
	}
</script>

<div class="VideoConverter">
	<MediaDisplay showOutput={!!outputURL} saveFile={saveFile}>
		<AudioOrVideo slot="input" mimeType={file.type} src={src}></AudioOrVideo>
		<AudioOrVideo slot="output" mimeType={generatedOutputMimeType} src={outputURL}></AudioOrVideo>
	</MediaDisplay>

	<panel->
		<div>
			Input Format: <code>{file.type}</code>
		</div>
		<br />

		<label>
			<div>Output Format</div>
			<select class="outlined-text-field" bind:value={outputMimeType}>
				{#if file.type.startsWith("video/")}
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

	panel- {
		padding: 0.5em;
	}
</style>