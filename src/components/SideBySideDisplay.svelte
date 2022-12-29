<script lang="ts">
	export let saveFile: ()=>void;
	export let showOutput: boolean;
</script>
<div class="SideBySide">
		<stack->
			<slot name=input></slot>
		</stack->

		{#if showOutput}
			<stack->
				<slot name=output></slot>
			</stack->
			<button 
				class="circle-button" 
				on:click={saveFile}
				title="Save File">
				<i class="fa fa-save"></i>
			</button>
	{/if}
</div>
<style>
	.SideBySide {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
		overflow: hidden;
		padding: .5em;
		grid-gap: .5em;
	}

	.circle-button {
		position: absolute;
		bottom: .2em;
		right: .2em;
	}
</style>