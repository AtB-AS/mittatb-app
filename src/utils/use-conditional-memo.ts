import React, {DependencyList} from 'react';

/**
 * useConditionalMemo will only recompute the memoized value when one of the deps has changed, AND if the
 * predicate allows it.
 *
 * @template T
 * @param {() => T} factory
 * @param {(DependencyList | undefined)} deps
 * @param {() => boolean} predicate
 * @returns T | undefined
 */
function useConditionalMemo<T>(
  factory: () => T,
  predicate: () => boolean,
  initial: T,
  deps: DependencyList,
) {
  const lastMemoValue = React.useRef<T>(initial);

  const value = React.useMemo<T>(
    () => (predicate() ? factory() : lastMemoValue.current),
    [...deps, predicate, initial],
  );

  lastMemoValue.current = value;
  return value;
}

export default useConditionalMemo;
