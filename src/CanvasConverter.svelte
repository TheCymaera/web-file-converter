<script lang="ts">
	import { onDestroy } from "svelte";
	import ConverterPage from "./components/ConverterPage.svelte";
	import Slider from "./components/Slider.svelte";
	import OutlinedSelectField from "./helion/OutlinedSelectField.svelte";
	import OutlinedNumberField from "./helion/OutlinedNumberField.svelte";
	import FilledButton from "./helion/FilledButton.svelte";

	export async function loadFile(file: File) {
		inputFile = file;
		generatedFile = undefined;

		inputImage?.close();
		inputImage = await createImageBitmap(file);
		outputWidth = inputImage.width;
		outputHeight = inputImage.height;
	}

	onDestroy(() => {
		inputImage?.close();
	});

	const allFormats = {
		"image/png": "png",
		"image/jpeg": "jpg",
		//"image/gif": "gif",
		"image/webp": "webp",
		//"image/bmp": "bmp",
	};

	// input
	let inputFile: File|undefined;
	let inputImage: ImageBitmap|undefined;
	
	// config
	let outputMimeType = "image/png";
	let outputQuality = 1;
	let outputWidth = 0;
	let outputHeight = 0;

	// generated
	let generatedFile: File|undefined;

	function convert() {
		if (!inputFile || !inputImage) return;

		const canvas = document.createElement("canvas");
		canvas.width = outputWidth;
		canvas.height = outputHeight;

		const ctx = canvas.getContext("2d")!;
		ctx.drawImage(inputImage, 0, 0, outputWidth, outputHeight);

		const outputBaseName = inputFile.name.slice(0, inputFile.name.lastIndexOf("."))
		const outputExtension = allFormats[outputMimeType].split(", ")[0]!;
		const outputFileName = outputBaseName + "." + outputExtension;

		canvas.toBlob(blob=>{
			if (!blob) return;
			generatedFile = new File([blob], outputFileName, {type: outputMimeType});
		}, outputMimeType, outputQuality);
	}
</script>

<ConverterPage {inputFile} outputFile={generatedFile}>
	<div>
		Input Format: <code class="bg-surface text-onSurface">{inputFile?.type}</code>
	</div>
	<br />

	<OutlinedSelectField 
		bind:value={outputMimeType} 
		label="Output Format" 
		options={Object.entries(allFormats).map(([mimeType, extensions])=>({value: mimeType, label: allFormats[mimeType] + " (" + extensions + ")"}))} 
	/>

	<br />

	<OutlinedNumberField 
		label="Output Width" 
		bind:value={outputWidth} 
		placeholder={inputImage?.width.toString()}
	/>

	<br />

	<OutlinedNumberField 
		label="Output Height" 
		bind:value={outputHeight} 
		placeholder={inputImage?.height.toString()}
	/>

	<br />

	<label style="display: {outputMimeType === "image/png" ? "none" : ""}">
		<div>Image Quality <small>(Lossy Compression)</small></div>
		<Slider step={.01} min={0} max={1} bind:value={outputQuality} />
		
		<br />
	</label>

	<FilledButton onPress={convert}>Convert</FilledButton>
</ConverterPage>