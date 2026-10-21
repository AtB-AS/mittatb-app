import {useCallback, useEffect, useRef, useState} from 'react';

// Only about this many result cards fit on screen, so they are rendered first
// and the rest once these are shown.
export const INITIAL_RENDER_COUNT = 5;
// Renders the rest anyway if the first cards never report being ready.
export const RENDER_ALL_FALLBACK_MS = 2000;

/**
 * Renders the first INITIAL_RENDER_COUNT results of a search first, and the
 * rest once those are ready to be shown. Later results of the same search, e.g.
 * from loading more trips, are rendered right away.
 *
 * Tracked per `searchKey`, so every different search starts over, also when
 * its results come straight from the cache without being cleared first.
 */
export function useProgressiveRendering(
  numberOfResults: number,
  searchKey: string,
) {
  const hasResults = numberOfResults > 0;
  const initialBatchSize = Math.min(INITIAL_RENDER_COUNT, numberOfResults);
  const [renderAllForSearch, setRenderAllForSearch] = useState<string>();
  const renderAll = renderAllForSearch === searchKey;
  const readyInitialRows = useRef({searchKey, indexes: new Set<number>()});

  useEffect(() => {
    if (!hasResults || renderAll) return;
    const timeout = setTimeout(
      () => setRenderAllForSearch(searchKey),
      RENDER_ALL_FALLBACK_MS,
    );
    return () => clearTimeout(timeout);
  }, [hasResults, renderAll, searchKey]);

  const onInitialRowReady = useCallback(
    (index: number) => {
      if (readyInitialRows.current.searchKey !== searchKey) {
        readyInitialRows.current = {searchKey, indexes: new Set()};
      }
      const {indexes} = readyInitialRows.current;
      indexes.add(index);
      if (indexes.size >= initialBatchSize) {
        setRenderAllForSearch(searchKey);
      }
    },
    [initialBatchSize, searchKey],
  );

  return {renderAll, onInitialRowReady};
}
