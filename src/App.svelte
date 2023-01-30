<script lang="ts">
import DragAndDrop from "./components/DragAndDrop.svelte";
import CanvasConverter from "./CanvasConverter.svelte";
import FFmpegConverter from "./FFmpegConverter.svelte";
import AppInfo from "./AppInfo.svelte";
import { tick } from "svelte";
import closeIcon from "./icons/times.svg";
import homeIcon from "./icons/home.svg";
import infoIcon from "./icons/info.svg";
import downloadIcon from "./icons/download.svg";
import backIcon from "./icons/angle-left.svg";
import Icon from "./components/Icon.svelte";


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
	<helion-standard-view>
		<helion-app-bar slot="header">
			<helion-app-bar-left>
			</helion-app-bar-left>
			<helion-app-bar-title>File Converter</helion-app-bar-title>
			<helion-app-bar-right>
				{#if updateAvailable}
					<a class="helion-app-bar-icon-button" href="./" title="An Update is Available. Reload?" style="color: var(--helion-color-accent);">
						<Icon url="{downloadIcon}" />
					</a>
				{/if}
				<a class="helion-app-bar-icon-button" href="/" title="Home">
					<Icon url="{homeIcon}" />
				</a>
				<button class="helion-app-bar-icon-button" on:click={()=>dialogOpen = true} title="Info">
					<Icon url="{infoIcon}" />
				</button>
			</helion-app-bar-right>
		</helion-app-bar>
		<helion-stack slot="body">
			<DragAndDrop onDrop={loadFiles}>
				<helion-center style="text-align: center; padding: 1em;">
					<p>
						Drag and drop a video, image, or audio file. <br />
						<small>All conversions are done locally in your browser. I never receive your files.</small>
					</p>
				</helion-center>
			</DragAndDrop>
		</helion-stack>
	</helion-standard-view>
{:else}
	<helion-standard-view>
		<helion-app-bar slot="header" center-title="">
			<helion-app-bar-left>
				<button class="helion-app-bar-icon-button" on:click={()=>file = undefined}>
					<Icon url="{backIcon}" />
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
						<small>All conversions are done locally in your browser. We never receive your files.</small>
					</p>
				</helion-center>
			</DragAndDrop>
		</helion-stack>
	</helion-standard-view>
{/if}

<helion-panel 
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
		<Icon url="{closeIcon}" />
	</button>
</helion-panel>