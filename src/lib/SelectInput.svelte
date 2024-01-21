<script lang="ts">
  export let id: string;
  export let value: number | null = null;
  export let options: { value: number; label: string }[] = [];
  export let label = '';

  function handleChange(event: Event) {
    const target = event.target as HTMLSelectElement;

    localStorage.setItem(id, target.value);
  }
</script>

<div class="mb-3">
  <label for={id} class="form-label">{label}</label>
  <select {id} class="form-select" bind:value on:change={handleChange}>
    {#each options as options}
      <option value={options.value}>{options.label}</option>
    {/each}
  </select>
</div>
