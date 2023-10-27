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
	class="
		grid overflow-hidden p-4 transition-opacity duration-100 ease-in-out
		{overlay ? "opacity-0 bg-surface text-onSurface pointer-events-none" : ""}
		{overlay && isDragging ? "!opacity-95 !pointer-events-auto" : ""}
	"

	on:drop|preventDefault={dropHandler}
	on:click={onClick}
>
	<div class="
		absolute inset-4 border-2 border-dashed rounded-md grid place-items-center transition-colors duration-100 ease-in-out
		{isDragging ? "border-primary-500" : "border-[currentColor]"}
	" />
	<slot></slot>
</div>