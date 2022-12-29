<script lang="ts">
export let onDrop: (file: File[]) => void;
export let overlay = false;
let isDragging = false;

function dropHandler(ev: DragEvent) {
  if (ev.dataTransfer?.items) {
		const files: File[] = [];
		for (const item of ev.dataTransfer.items) {
			if (item.kind !== 'file') continue;
			const file = item.getAsFile()!;
			files.push(file);
		}
		if (files.length) onDrop(files);
  }
}

let timeout = 0;
function onDrag() {
	clearInterval(timeout);
	isDragging = true;
	timeout = setTimeout(() => {
		isDragging = false;
		timeout = 0;
	}, 100);
}

function onClick() {
	const input = document.createElement('input');
	input.type = 'file';
	input.multiple = false;
	input.onchange = () => {
		if (input.files) onDrop(Array.from(input.files));
	}
	input.click();
}

</script>
<svelte:body on:dragover|preventDefault={onDrag} />

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class="stack"
	class:isDragging
	class:isOverlay={overlay}

	on:drop|preventDefault={dropHandler}
	on:click={onClick}
>
	<slot></slot>
</div>

<style>
div {
	padding: 1em;
	transition: opacity .1s ease;
}

div::after {
	content: "";
	position: absolute;
	inset: 1em;

	border: .2em dashed currentColor;
	border-radius: .5em;
	transition: border-color .1s ease;
}

.isDragging::after {
	border-color: var(--color-accent);
}

.isOverlay {
	opacity: 0;
	background-color: var(--color-backdrop-background);
	pointer-events: none;
}

.isOverlay.isDragging  {
	opacity: .95;
	pointer-events: all;
}
</style>