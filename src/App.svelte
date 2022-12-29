<script lang="ts">
import DropZone from "./components/DropZone.svelte";
import CanvasConverter from "./CanvasConverter.svelte";
import FFmpegConverter from "./FFmpegConverter.svelte";
import AppInfo from "./AppInfo.svelte";

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

let file: File|undefined;
let converter: typeof CanvasConverter|typeof FFmpegConverter;

function loadFiles(files: File[]) {
	file = files[0]!;

	for (const provider of converters) {
		if (provider.supports(file)) {
			converter = provider.converter;
			return;
		}
	}
	
	alert("This file is not supported or is malformed\nMime Type: " + (file.type || "EMPTY"));
	file = undefined;
}


let updateAvailable = false;
let dialogOpen = false;
</script>

{#if !file}
	<standard-view>
		<app-bar slot="header">
			<app-bar-left>
			</app-bar-left>
			<app-bar-title>File Converter</app-bar-title>
			<app-bar-right>
				{#if updateAvailable}
					<a class="app-bar-icon-button" href="./" title="An Update is Available. Reload?" style="color: var(--color-accent);">
						<i class="fa fa-download"></i>
					</a>
				{/if}
				<a class="app-bar-icon-button" href="/" title="Home">
					<i class="fa fa-home"></i>
				</a>
				<button class="app-bar-icon-button" on:click={()=>dialogOpen = true} title="Info">
					<i class="fa fa-info"></i>
				</button>
			</app-bar-right>
		</app-bar>
		<stack- slot="body">
			<DropZone onDrop={loadFiles}>
				<center- style="text-align: center;">
					<p>
						Drag and drop a video, image, or audio file. <br />
						<small>All conversions are done locally in your browser. We never receive your files.</small>
					</p>
				</center->
			</DropZone>
		</stack->
	</standard-view>
{:else}
	<standard-view>
		<app-bar slot="header" center-title="">
			<app-bar-left>
				<button class="app-bar-icon-button" on:click={()=>file = undefined}>
					<i class="fa fa-angle-left"></i>
				</button>
			</app-bar-left>
			<app-bar-title>Convert File</app-bar-title>
			
		</app-bar>
		<stack- slot="body">
			<svelte:component this={converter} file={file} />

			<DropZone onDrop={loadFiles} overlay={true}>
				<center- style="text-align: center;">
					<p>
						Drag and drop a video, image, or audio file. <br />
						<small>All conversions are done locally in your browser. We never receive your files.</small>
					</p>
				</center->
			</DropZone>
		</stack->
	</standard-view>
{/if}

<panel- 
	style="
		opacity: {dialogOpen ? 1 : 0};
		pointer-events: {dialogOpen ? "all" : "none"};
		transition: opacity .1s;
	">
	<div style="margin: auto; max-width: 800px; padding: .5em 1em;">
		<AppInfo />
	</div>
	<button 
		class="circle-button" 
		style="position: absolute; right: 0.5em; top: 0.5em;"
		title="Close"
		on:click={()=>dialogOpen = false}
	>
		<i class="fa fa-times"></i>
	</button>
</panel->