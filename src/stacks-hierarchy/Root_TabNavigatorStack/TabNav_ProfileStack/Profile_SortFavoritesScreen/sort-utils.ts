// Code by Ben Awad
// from https://github.com/benawad/drag-n-drop-flatlist/blob/master/SortableList.tsx
export function immutableMove<T>(arr: T[], from: number, to: number) {
  return arr.reduce<T[]>((prev, current, idx, self) => {
    if (from === to) {
      prev.push(current);
    }
    if (idx === from) {
      return prev;
    }
    if (from < to) {
      prev.push(current);
    }
    if (idx === to) {
      prev.push(self[from]);
    }
    if (from > to) {
      prev.push(current);
    }
    return prev;
  }, []);
}
