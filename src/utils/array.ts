export function flatMap<T, U>(
  array: T[],
  callbackfn: (value: T, index: number, array: T[]) => U[],
): U[] {
  return Array.prototype.concat(...array.map(callbackfn));
}

export function updateObjectInArray<T>(
  array: T[],
  updatedItemProps: Partial<T>,
  index: number,
) {
  return array.map((item, idx) => {
    if (index !== idx) {
      return item;
    }

    return {
      ...item,
      ...updatedItemProps,
    };
  });
}
