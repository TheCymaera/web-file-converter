<script lang="ts">
	export let onPress: () => void;
	export let disabled = false;

	let classes = "";
	export { classes as class }; 
</script>
<button 
	on:click={onPress}
	class="
		{classes}
		text-lg bg-primary-500 text-onPrimary rounded-full py-2 px-5
		hover:bg-primary-400 active:bg-primary-600
		{disabled ? "opacity-50 cursor-not-allowed" : ""}
	"
>
	<slot />
</button>