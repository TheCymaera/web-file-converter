<script lang="ts">
	type T = $$Generic;

	export let value: T;
	export let label = "";
	export let readonly = false;
	export let options: { value: T, label: string }[] = [];
	export let hint = "";
	export let error = "";

	export let boxClasses = "";

	export let onChange = ()=>{};

	let classes = "";
	export { classes as class };
</script>

<label class="flex flex-col {classes}">
	<div class="pl-1">{label}</div>
	<select class="
		w-full p-2 border-[.08rem] bg-transparent border-divider rounded-md flex-1 {boxClasses}
		outline-none 
		outline-[3px] outline-offset-[-3px]
		focus:outline-primary-500 focus:border-primary-500" bind:value={value} disabled={readonly} on:change={onChange}>
		{#each options as {value, label: text}}
			<option class="bg-surfaceContainer" value={value}>{text}</option>
		{/each}
	</select>
	<output class="pl-1" style:display={(error || hint) ? "" : "none"}>
		<small class="whitespace-pre {error ? "text-red-500" : ""}">{error || hint}</small>
	</output>
</label>