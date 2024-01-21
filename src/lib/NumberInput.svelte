<script lang="ts">
  export let id: string;
  export let label = '';
  export let value: number | null = null;
  export let min: number | undefined = undefined;
  export let max: number | undefined = undefined;

  function limitNumber(
    value: number,
    min: number | undefined,
    max: number | undefined,
  ): number {
    if (min !== undefined && value < min) {
      return min;
    }

    if (max !== undefined && value > max) {
      return max;
    }

    return value;
  }

  function handleInput(event: Event) {
    event.preventDefault();
    const target = event.target as HTMLInputElement;

    if (!min || !max) {
      localStorage.setItem(id, target.value);
    } else {
      if (target.value === '') {
        value = null;
      } else {
        const newValue = Number(target.value);
        const limitedValue = limitNumber(newValue, min, max);

        // @ts-ignore
        target.value = limitedValue;
        value = limitedValue;

        localStorage.setItem(id, target.value);
      }
    }
  }
</script>

<div class="mb-3">
  <label for={id} class="form-label">{label}</label>
  <input
    {id}
    class="form-control"
    type="number"
    bind:value
    on:input={handleInput}
  />
</div>
