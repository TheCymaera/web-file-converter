<script lang="ts">
	import Icon from "./Icon.svelte";
	import MediaDisplay from "./MediaDisplay.svelte";
	import saveIcon from "../icons/save.svg";

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
<div class="ConverterPage">
	<helion-wrapping-grid
		class="SideBySide" 
		class:showOutput={outputFile !== undefined}
		style="--min-column-width: 500px;"
		sizing="max"
	>
		<helion-stack>
			{#if inputFile}
				<MediaDisplay file={inputFile} />
			{/if}
		</helion-stack>

		<helion-stack>
			{#if outputFile}
				<MediaDisplay file={outputFile} />
			{/if}
		</helion-stack>
		<button 
			class="helion-circle-button" 
			on:click={saveFile}
			title="Save File">
			<Icon url="{saveIcon}" />
		</button>
	</helion-wrapping-grid>

	<helion-panel>
		<slot></slot>
	</helion-panel>
</div>

<style>
	.ConverterPage {
		display: grid;
		grid-template-columns: auto 300px;
	}

	/* make the sections appear on top of one another on mobile */
	@media (max-width: 600px) {
		.ConverterPage {
			grid-template-columns: unset;
			grid-template-rows: 1fr 1fr;
		}
	}

	.SideBySide {
		overflow: hidden;
		padding: .5em;
		grid-gap: .5em;
	}

	.helion-circle-button {
		position: absolute;
		bottom: .2em;
		right: .2em;
	}

	.SideBySide:not(.showOutput) > :not(:first-child) {
		display: none;
	}

	/* hide the first slot on mobile if there is a second slot */
	@media (max-width: 600px) {
		.SideBySide.showOutput > :first-child {
			display: none;
		}
	}

	helion-panel {
		padding: .5em;
	}
</style>