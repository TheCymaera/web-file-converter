<script lang="ts">
export let href: string | undefined = undefined;
export let label: string;
export let onPress: (() => void) | undefined = undefined;

const alLClasses = `
	text-lg grid place-items-center h-12 w-12 relative
	before:h-[150%] before:w-[150%] before:rounded-full before:bg-[currentColor] before:content-[''] before:absolute
	before:opacity-0 before:transition-opacity before:duration-300 before:ease-in-out
	hover:before:opacity-10 active:before:opacity-20
`
</script>

{#if href}
	<a on:click={onPress} href={href} title={label} class={alLClasses}>
		<slot />
	</a>
{:else}
	<button on:click={onPress} title={label} class={alLClasses}>
		<slot />
	</button>
{/if}