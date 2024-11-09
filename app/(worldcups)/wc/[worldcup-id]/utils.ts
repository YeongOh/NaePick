export function getRoundsDescription(round: number): string {
  if (round <= 2) return '결승전';
  if (round <= 4) return '준결승전';

  for (const each of [8, 16, 32, 64, 128, 256, 512, 1024]) {
    if (round <= each) {
      return `${each}강`;
    }
  }

  return '';
}
