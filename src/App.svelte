<script lang="ts">
import DragAndDrop from "./components/DragAndDrop.svelte";
import CanvasConverter from "./CanvasConverter.svelte";
import FFmpegConverter from "./FFmpegConverter.svelte";
import AppInfo from "./AppInfo.svelte";
import { tick } from "svelte";
import { fa5_solid_angleLeft, fa5_solid_download, fa5_solid_home, fa5_solid_info, fa5_solid_times } from "fontawesome-svgs";


let loadFile: (file: File)=>any;
let file: File|undefined;

const converters = [
	{
		supports: (file: File)=>["image/png", "image/jpeg", "image/webp"].includes(file.type),
		converter: CanvasConverter,
	},
	{
		supports: (file: File)=>file.type.startsWith("video/") || file.type.startsWith("audio/"),
		converter: FFmpegConverter,
	},
];

let converter: typeof CanvasConverter|typeof FFmpegConverter;

async function loadFiles(files: File[]) {
	const newFile = files[0]!;

	for (const provider of converters) {
		if (provider.supports(newFile)) {
			converter = provider.converter;
			file = newFile;
			await tick(); // wait for the component to be created
			loadFile(newFile)
			return;
		}
	}

	alert("This file is not supported or is malformed\nMime Type: " + (newFile.type || "(empty)"));
}


let updateAvailable = false;
let dialogOpen = false;
</script>

{#if !file}
	<helion-standard-view class="helion-fill-parent">
		<helion-app-bar slot="header">
			<helion-app-bar-left>
			</helion-app-bar-left>
			<helion-app-bar-title>File Converter</helion-app-bar-title>
			<helion-app-bar-right>
				{#if updateAvailable}
					<a class="helion-app-bar-icon-button" href="./" title="An Update is Available. Reload?" style="color: var(--helion-color-accent);">
						{@html fa5_solid_download}
					</a>
				{/if}
				<a class="helion-app-bar-icon-button" href="/" title="Home">
					{@html fa5_solid_home}
				</a>
				<button class="helion-app-bar-icon-button" on:click={()=>dialogOpen = true} title="Info">
					{@html fa5_solid_info}
				</button>
			</helion-app-bar-right>
		</helion-app-bar>
		<helion-stack slot="body">
			<DragAndDrop onDrop={loadFiles}>
				<helion-center style="text-align: center; padding: 1em;">
					<p>
						Drag and drop a video, image, or audio file. <br />
						<small>All files are processed locally in your browser. I never receive your files.</small>
					</p>
				</helion-center>
			</DragAndDrop>
		</helion-stack>
	</helion-standard-view>
{:else}
	<helion-standard-view class="helion-fill-parent">
		<helion-app-bar slot="header" center-title="">
			<helion-app-bar-left>
				<button class="helion-app-bar-icon-button" on:click={()=>file = undefined}>
					{@html fa5_solid_angleLeft}
				</button>
			</helion-app-bar-left>
			<helion-app-bar-title>Convert File</helion-app-bar-title>
			
		</helion-app-bar>
		<helion-stack slot="body">
			<svelte:component this={converter} bind:loadFile />

			<DragAndDrop onDrop={loadFiles} overlay={true}>
				<helion-center style="text-align: center; padding: 1em;">
					<p>
						Drag and drop a video, image, or audio file. <br />
						<small>All files are processed locally in your browser. I never receive your files.</small>
					</p>
				</helion-center>
			</DragAndDrop>
		</helion-stack>
	</helion-standard-view>
{/if}

<helion-panel 
	class="helion-fill-parent"
	style="
		opacity: {dialogOpen ? 1 : 0};
		pointer-events: {dialogOpen ? "all" : "none"};
		transition: opacity .1s;
	">
	<div style="height: 100%; overflow: auto;">
		<div style="
			margin: auto; 
			max-width: 800px; 
			padding: .5em 1em;
		">
			<AppInfo />
		</div>
	</div>
	<button 
		class="helion-circle-button" 
		style="position: absolute; right: 0.5em; top: 0.5em;"
		title="Close"
		on:click={()=>dialogOpen = false}
	>
		{@html fa5_solid_times}
	</button>
</helion-panel>