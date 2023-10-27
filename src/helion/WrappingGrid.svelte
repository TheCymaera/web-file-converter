<script lang="ts">
	export let expand = false;
	export let minColumnWidth: string;

	let classes = "";
	export { classes as class };
</script>
<helion-wrapping-grid class="{classes}" expand={expand ? "" : undefined} style="--min-column-width: {minColumnWidth}">
	<slot />
</helion-wrapping-grid>
<style>
helion-wrapping-grid {
	--min-column-width: 100px;
	
	--_repeat-mode: auto-fill;

	--grid-template: repeat(var(--_repeat-mode), minmax(min(100%, var(--min-column-width)), 1fr));

	display: grid;
	grid-template-columns: var(--grid-template);
	grid-template-rows: unset;
	/*&[axis=vertical] {
		grid-template-columns: unset;
		grid-template-rows: var(--grid-template);
	}*/
}

helion-wrapping-grid[expand] {
	--_repeat-mode: auto-fit;
}
</style>