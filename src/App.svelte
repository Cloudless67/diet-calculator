<script lang="ts">
  import { onMount } from 'svelte';
  import NumberInput from './lib/NumberInput.svelte';
  import formatNumber from './utils/formatNumber';
  import SelectInput from './lib/SelectInput.svelte';

  let sex: number | null = null;
  let intensity: number | null = null;
  let fat: number | null = null;
  let weight: number | null = null;
  let height: number | null = null;
  let age: number | null = null;
  let activity: number | null = null;
  let exercise: number | null = null;

  onMount(() => {
    sex = Number(localStorage.getItem('sex') ?? '0');
    intensity = Number(localStorage.getItem('intensity') ?? '0');
    fat = Number(localStorage.getItem('fat') ?? '0');
    weight = Number(localStorage.getItem('weight') ?? '0');
    height = Number(localStorage.getItem('height') ?? '0');
    age = Number(localStorage.getItem('age') ?? '0');
    activity = Number(localStorage.getItem('activity') ?? '0');
    exercise = Number(localStorage.getItem('exercise') ?? '0');
  });

  $: proteinPerWeight = fat && 4.8 - fat / 10;
  $: basalMetabolicRate =
    weight &&
    height &&
    age &&
    (sex === 1
      ? 88.4 + 13.4 * weight + 4.8 * height - 5.68 * age
      : 447.6 + 9.25 * weight + 3.1 * height - 4.33 * age);
  $: activityCoeff = activity && exercise !== null ? activity + exercise : 0;
  $: dailyCalorieConsumption =
    basalMetabolicRate && activityCoeff && basalMetabolicRate * activityCoeff;
  $: caloriesToEat =
    dailyCalorieConsumption &&
    intensity &&
    dailyCalorieConsumption * (0.9 - ((intensity - 1) / 10) * 0.75);
  $: caloriesToEatPerMeal = caloriesToEat && caloriesToEat / 3;
  $: proteinToEat = weight && proteinPerWeight && proteinPerWeight * weight;
  $: chickenToEat = proteinToEat && proteinToEat / 22;
  $: dailyProteinCalories = chickenToEat && chickenToEat * 110;
  $: caloriesToEatWithoutProtein =
    caloriesToEat &&
    dailyProteinCalories &&
    caloriesToEat - dailyProteinCalories;
  $: fatToEat = caloriesToEat && caloriesToEat * 0.275;
  $: carbohydratesToEat =
    caloriesToEat &&
    dailyProteinCalories &&
    fatToEat &&
    caloriesToEat - fatToEat - dailyProteinCalories;
</script>

<main class="container pt-3">
  <form class="row">
    <div class="col-lg-4">
      <SelectInput
        id="sex"
        label="성별"
        options={[
          { value: 1, label: '남성' },
          { value: 2, label: '여성' },
        ]}
        bind:value={sex}
      />
    </div>
    <div class="col-lg-4">
      <NumberInput
        id="intensity"
        label="체중감량 강도 1~5 (4,5는 근손실 가능성 존재)"
        bind:value={intensity}
        min={1}
        max={5}
      />
    </div>
    <div class="col-lg-4">
      <NumberInput id="fat" label="체지방(%)" bind:value={fat} />
    </div>
    <div class="col-lg-4">
      <NumberInput id="weight" label="체중(kg)" bind:value={weight} />
    </div>
    <div class="col-lg-4">
      <NumberInput id="height" label="키(cm)" bind:value={height} />
    </div>
    <div class="col-lg-4">
      <NumberInput id="age" label="나이(만)" bind:value={age} />
    </div>
    <div class="col-lg-4">
      <SelectInput
        id="activity"
        label="활동량"
        options={[
          { value: 1.2, label: '적은 활동' },
          { value: 1.4, label: '중간 활동' },
          { value: 1.6, label: '많은 활동' },
        ]}
        bind:value={activity}
      />
    </div>
    <div class="col-lg-4">
      <SelectInput
        id="exercise"
        label="운동량"
        options={[
          { value: 0, label: '주 0회' },
          { value: 0.1, label: '주 1~3회' },
          { value: 0.2, label: '주 4~6회' },
          { value: 0.3, label: '주 7회 이상' },
        ]}
        bind:value={exercise}
      />
    </div>
  </form>
  <table class="table table-striped">
    <tbody>
      <tr>
        <td>몸무게(kg)당 먹어야 하는 단백질(g)</td>
        <td>{formatNumber(proteinPerWeight)}</td>
      </tr>
      <tr>
        <td
          ><details>
            해당 기초대사량은 Haris-Benedict 방정식을 사용하여 계산되었습니다
            <summary>기초대사량(kcal)</summary>
          </details></td
        >
        <td>{formatNumber(basalMetabolicRate)}</td>
      </tr>
      <tr>
        <td>일일 예상 칼로리소비량(kcal)</td>
        <td>{formatNumber(dailyCalorieConsumption)}</td>
      </tr>
      <tr>
        <td>체중 감량시 하루섭취 칼로리(kcal)</td>
        <td>{formatNumber(caloriesToEat)}</td>
      </tr>
      <tr>
        <td>체중 감량시 1끼섭취 칼로리(kcal), 3끼기준</td>
        <td>{formatNumber(caloriesToEatPerMeal)}</td>
      </tr>
      <tr>
        <td>하루 섭취 단백질 필요량(g)</td>
        <td>{formatNumber(proteinToEat)}</td>
      </tr>
      <tr>
        <td>하루 닭찌/프로틴 섭취필요 횟수(1회 22g기준)</td>
        <td>{formatNumber(chickenToEat)}</td>
      </tr>
      <tr>
        <td>하루 닭찌/프로틴 칼로리(kcal)</td>
        <td>{formatNumber(dailyProteinCalories)}</td>
      </tr>
      <tr>
        <td>하루 단백질 제외 권장 칼로리(kcal)</td>
        <td>{formatNumber(caloriesToEatWithoutProtein)}</td>
      </tr>
      <tr>
        <td>하루 섭취 지방 필요 칼로리(kcal)</td>
        <td>{formatNumber(fatToEat)}</td>
      </tr>
      <tr>
        <td>하루 섭취 탄수화물 권장 칼로리(kcal)</td>
        <td>{formatNumber(carbohydratesToEat)}</td>
      </tr>
    </tbody>
  </table>
</main>

<style>
  details > summary {
    list-style: none;
  }
  summary::after {
    content: ' ►';
  }
  details[open] summary:after {
    content: ' ▼';
  }
</style>
