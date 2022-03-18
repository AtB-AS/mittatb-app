export function flatMap<T, U>(
  array: T[],
  callbackfn: (value: T, index: number, array: T[]) => U[],
): U[] {
  return Array.prototype.concat(...array.map(callbackfn));
}

/*
Takes an array and an element and returns a new array with the given element
inserted in between every element of the original array.

E.g. interpose([1,2,3], '+') -> [1, '+', 2, '+', 3]
*/
export function interpose<T, U>(array: Array<T>, delim: U) {
  return flatMap(array, (el) => [delim, el]).slice(1);
}
