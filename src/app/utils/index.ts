export function formatTime(value: number) {
  const seconds = String(value % 60).padStart(2, '0');
  const minutes = String(Math.floor(value / 60)).padStart(2, '0');

  return `${minutes}:${seconds}`;
}
