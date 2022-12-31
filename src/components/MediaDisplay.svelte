<script lang="ts">
	export let file: File;

	let src = "";
	$: {
		if (src) URL.revokeObjectURL(src);
		src = URL.createObjectURL(file);
	}
</script>
{#if file.type.startsWith("image/")}
	<img src={src} alt="" />
{:else if file.type.startsWith("video/")}
	<!-- svelte-ignore a11y-media-has-caption -->
	<video src={src} controls />
{:else if file.type.startsWith("audio/")}
	<helion-center>
		<audio src={src} controls />
	</helion-center>
{:else}
	<p>File type cannot be displayed</p>
{/if}
<style>
	img,
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