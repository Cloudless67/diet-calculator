export default function formatNumber(number: number | null): string {
  if (number === null) {
    return '-';
  }
  return number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}
