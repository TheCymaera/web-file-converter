<script lang="ts">
	export let url: string;
</script>
<div class="Icon" style="--image: url('{url}')"></div>
<style>
	.Icon {
		height: 1em;
		width: 1.3em;
		background-color: currentColor;

		mask: var(--image);
		-webkit-mask: var(--image);
		mask-size: contain;
		-webkit-mask-size: contain;
		mask-position: center;
		-webkit-mask-position: center;
		mask-repeat: no-repeat;
		-webkit-mask-repeat: no-repeat;
	}
</style>