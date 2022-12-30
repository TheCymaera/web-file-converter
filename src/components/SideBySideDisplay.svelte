<script lang="ts">
	import Icon from "./Icon.svelte";
	import saveIcon from "../icons/save.svg";


	export let saveFile: ()=>void;
	export let showOutput: boolean;
</script>
<helion-wrapping-grid
	class="SideBySide" 
	class:showOutput={showOutput}
	style="--min-column-width: 500px;"
	sizing="max"
>
	<helion-stack>
		<slot name=input></slot>
	</helion-stack>

	<helion-stack>
		<slot name=output></slot>
	</helion-stack>
	<button 
		class="helion-circle-button" 
		on:click={saveFile}
		title="Save File">
		<Icon url="{saveIcon}" />
	</button>
</helion-wrapping-grid>
<style>
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
</style>