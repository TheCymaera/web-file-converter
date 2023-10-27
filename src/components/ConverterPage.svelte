<script lang="ts">
	import { fa5_solid_save } from "fontawesome-svgs";
	import MediaDisplay from "./MediaDisplay.svelte";
	import WrappingGrid from "../helion/WrappingGrid.svelte";
	import CircleButton from "../helion/CircleButton.svelte";

	export let inputFile: File|undefined;
	export let outputFile: File|undefined;

	function saveFile() {
		if (!outputFile) return;
		const a = document.createElement("a");
		a.href = URL.createObjectURL(outputFile);
		a.download = outputFile.name;
		a.click();
		URL.revokeObjectURL(a.href);
	}
</script>
<div class="grid grid-cols-[auto,300px] max-md:grid-cols-[1fr] max-md:grid-rows-[min-content,1fr]">
	<WrappingGrid
		class="relative SideBySide gap-3 {outputFile !== undefined ? 'showOutput' : ''}"
		minColumnWidth="500px"
		expand={true}
	>
		<div class="relative [&>*]:!inset-0 [&>*]:!w-full [&>*]:!h-full [&>*]:!absolute">
			{#if inputFile}
				<MediaDisplay file={inputFile} />
			{/if}
		</div>

		<div class="relative [&>*]:!inset-0 [&>*]:!w-full [&>*]:!h-full [&>*]:!absolute">
			{#if outputFile}
				<MediaDisplay file={outputFile} />
			{/if}
		</div>
		<CircleButton 
			onPress={saveFile}
			class="absolute bottom-1 right-1"
			label="Save File">
			{@html fa5_solid_save}
		</CircleButton>
	</WrappingGrid>

	<div class="bg-surfaceContainer text-onSurfaceContainer p-3">
		<slot></slot>
	</div>
</div>

<style>
	:global(.SideBySide) {
		overflow: hidden;
		padding: .5em;
		grid-gap: .5em;
	}

	:global(.SideBySide:not(.showOutput) > :not(:first-child)) {
		display: none;
	}

	/* hide the first slot on mobile if there is a second slot */
	@media (max-width: 600px) {
		:global(.SideBySide.showOutput > :first-child) {
			display: none;
		}
	}
</style>