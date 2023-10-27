<script lang="ts">
import DragAndDrop from "./components/DragAndDrop.svelte";
import CanvasConverter from "./CanvasConverter.svelte";
import FFmpegConverter from "./FFmpegConverter.svelte";
import AppInfo from "./AppInfo.svelte";
import IconButton from "./helion/IconButton.svelte";
import { tick } from "svelte";
import { fa5_solid_home, fa5_solid_info, fa5_solid_times } from "fontawesome-svgs";
  import CircleButton from "./helion/CircleButton.svelte";


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


let dialogOpen = false;
</script>


<div class="absolute inset-0 grid grid-rows-[min-content,1fr] z-0">
	<div class="bg-surfaceContainer text-onSurfaceContainer flex overflow-hidden items-center z-10 shadow">
		<h1 class="flex-1 px-3 font-bold">File Converter</h1>
		<IconButton href="/" label="Home">
			{@html fa5_solid_home}
		</IconButton>
		<IconButton onPress={()=>dialogOpen = true} label="Info">
			{@html fa5_solid_info}
		</IconButton>
	</div>
	<div class="relative [&>*]:!absolute [&>*]:!inset-0  z-0">
		{#if file}
			<svelte:component this={converter} bind:loadFile />
		{/if}

		<DragAndDrop onDrop={loadFiles} overlay={!!file}>
			<div class="text-center grid place-items-center p-4">
				<p>
					Drag and drop a video, image, or audio file. <br />
					<small>All files are processed locally in your browser. I never receive your files.</small>
				</p>
			</div>
		</DragAndDrop>
	</div>
</div>
<div class="absolute inset-0 z-20 bg-surface text-onSurface"
	style="
		opacity: {dialogOpen ? 1 : 0};
		pointer-events: {dialogOpen ? "all" : "none"};
		transition: opacity .1s;
	">
	<div class="h-full overflow-auto">
		<div 
			class="m-auto max-w-[800px] py-4 px-2">
			<AppInfo />
		</div>
	</div>
	<CircleButton 
		class="absolute right-2 top-2"
		label="Close"
		onPress={()=>dialogOpen = false}
	>
		{@html fa5_solid_times}
	</CircleButton>
</div>