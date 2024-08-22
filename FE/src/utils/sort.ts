export const genericSort = <T>(arr: T[], compareFunc: (a: T, b: T) => number): T[] => {
  return [...arr].sort(compareFunc);
};

export function sortObjectsByKey<T extends object, K extends keyof T>(
  arr: T[],
  key: K,
  ascending: boolean = true
): T[] {
  return [...arr].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    if (aVal == null) return ascending ? 1 : -1;
    if (bVal == null) return ascending ? -1 : 1;
    if (aVal < bVal) return ascending ? -1 : 1;
    if (aVal > bVal) return ascending ? 1 : -1;
    return 0;
  });
}
