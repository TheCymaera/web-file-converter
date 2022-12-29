<script lang="ts">
	export let src: string;
	export let mimeType: string;
</script>
{#if mimeType.startsWith("video/")}
	<!-- svelte-ignore a11y-media-has-caption -->
	<video src={src} controls />
{:else if mimeType.startsWith("audio/")}
	<audio src={src} controls />
{:else}
	<p>File type cannot be displayed</p>
{/if}
<style>
video {
	display: block;
	object-fit: contain;
	width: 100%;
}
audio {
	display: block;
	width: 100%;
}
</style>