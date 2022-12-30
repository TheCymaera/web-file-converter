<script lang="ts">
	export let saveFile: ()=>void;
	export let showOutput: boolean;
</script>
<div
	class="SideBySide" 
	class:showOutput={showOutput}
	style="--min-column-width: 500px;"
>
	<stack->
		<slot name=input></slot>
	</stack->

	<stack->
		<slot name=output></slot>
	</stack->
	<button 
		class="circle-button" 
		on:click={saveFile}
		title="Save File">
		<i class="fa fa-save"></i>
	</button>
</div>
<style>
	.SideBySide {
		overflow: hidden;
		padding: .5em;
		grid-gap: .5em;

		display: grid;
		grid-template-columns: repeat(var(--_repeat-mode), minmax(min(100%, var(--min-column-width)), 1fr))
	}

	.circle-button {
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