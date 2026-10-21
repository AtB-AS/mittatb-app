import {useCallback, useEffect, useRef, useState} from 'react';

// Only about this many result cards fit on screen, so they are rendered first
// and the rest once these are shown.
export const INITIAL_RENDER_COUNT = 5;
// Renders the rest anyway if the first cards never report being ready.
export const RENDER_ALL_FALLBACK_MS = 2000;

/**
 * Renders the first INITIAL_RENDER_COUNT results of a search first, and the
 * rest once those are ready to be shown. Later results, e.g. from loading more
 * trips, are rendered right away. Resets when the results are cleared for a
 * new search.
 */
export function useProgressiveRendering(numberOfResults: number) {
  const hasResults = numberOfResults > 0;
  const initialBatchSize = Math.min(INITIAL_RENDER_COUNT, numberOfResults);
  const [renderAll, setRenderAll] = useState(false);
  const readyInitialRows = useRef(new Set<number>());

  useEffect(() => {
    if (hasResults) return;
    readyInitialRows.current.clear();
    setRenderAll(false);
  }, [hasResults]);

  useEffect(() => {
    if (!hasResults || renderAll) return;
    const timeout = setTimeout(
      () => setRenderAll(true),
      RENDER_ALL_FALLBACK_MS,
    );
    return () => clearTimeout(timeout);
  }, [hasResults, renderAll]);

  const onInitialRowReady = useCallback(
    (index: number) => {
      readyInitialRows.current.add(index);
      if (readyInitialRows.current.size >= initialBatchSize) {
        setRenderAll(true);
      }
    },
    [initialBatchSize],
  );

  return {renderAll, onInitialRowReady};
}
