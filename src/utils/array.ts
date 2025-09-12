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

/*
Takes an array and returns an array of pairs: {current, next}
E.g. iterateWithNext([1, 2, 3, 4]) -> [{1, 2}, {2, 3}, {3, 4}]
Warning: when an array of 1 element is given, no pairs are returned []
 */
export function iterateWithNext<T>(
  iterable: Array<T>,
): {current: T; next: T}[] {
  function* generator<T>(iterable: Array<T>) {
    const iterator = iterable[Symbol.iterator]();
    let current = iterator.next();
    let next = iterator.next();
    while (!next.done) {
      yield {current: current.value, next: next.value};
      current = next;
      next = iterator.next();
    }
  }
  return [...generator(iterable)] as {current: T; next: T}[];
}
