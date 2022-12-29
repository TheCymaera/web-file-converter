<script lang="ts">
	export let min: number;
	export let max: number;
	export let step: number;

	export let value: number;
</script>
<div class="SliderContainer">
	<span>{min}</span>
	<input type="range" {step} {min} {max} bind:value={value}>
	<span>{max}</span>
</div>
<small style="display: block; text-align: center">{value}</small>
<style>
	.SliderContainer {
		display: grid; 
		grid-template-columns: min-content 1fr min-content
	}

	.SliderContainer > span {
		padding: 0 .5em;
	}
</style>