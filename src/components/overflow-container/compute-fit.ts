export type FitResult = {
  visibleCount: number;
  needsOverflow: boolean;
};

/**
 * Greedily fit children left-to-right within `maxWidth`. Reserves space for the
 * overflow badge (`overflowWidth + gap`) after every item except the last, so a
 * set that fits exactly shows no badge. Pure (no React/RN), so the fit logic is
 * unit-testable without rendering.
 */
export function computeFit({
  widths,
  overflowWidth,
  maxWidth,
  gap,
}: {
  widths: number[];
  overflowWidth: number;
  maxWidth: number;
  gap: number;
}): FitResult {
  let currentWidth = 0;
  let visibleCount = 0;

  for (let i = 0; i < widths.length; i++) {
    const isLast = i === widths.length - 1;
    const gapBefore = i > 0 ? gap : 0;
    const overflowReserve = isLast ? 0 : overflowWidth + gap;

    if (currentWidth + gapBefore + widths[i] + overflowReserve <= maxWidth) {
      currentWidth += gapBefore + widths[i];
      visibleCount++;
    } else {
      break;
    }
  }

  return {visibleCount, needsOverflow: visibleCount < widths.length};
}
