// MatDialog schliesst erst nach der CSS-Transition (setTimeout) ab; whenStable() wartet darauf nicht.
export function flushDialog(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 200));
}
