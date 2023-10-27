<script lang="ts">
	export let onPress: () => void;
	export let label: string;

	let classes = "";
	export { classes as class };
</script>
<button 
	on:click={onPress}
	title={label}
	class="
	text-lg bg-primary-500 text-onPrimary rounded-full w-12 h-12 grid place-items-center transition-colors duration-100 ease-in-out
	hover:bg-primary-400 active:bg-primary-600
	{classes}
">
	<slot />
</button>