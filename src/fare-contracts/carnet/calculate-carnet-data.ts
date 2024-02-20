/**
 * The number of accesses that should be displayed in a single row. To display
 * the correct amount of consumed carnets, maximumNumberOfAccesses should be
 * divisible by this number.
 */
export const CARNET_DIVIDER = 10;

/**
 * Get the arrays required to display the carnet footer dots.
 * `multi-carnet dots --- unused dots --- active dots --- used dots`
 *
 * @param active the ticket status (active | inactive).
 * @param maximumNumberOfAccesses total amount of available access that the carnet has.
 * @param numberOfUsedAccesses total amount of used access that the carnet has.
 * @returns values to display the carnet footer, it will be displayed in this order :
 */
export function calculateCarnetData(
  active: boolean,
  maximumNumberOfAccesses: number,
  numberOfUsedAccesses: number,
) {
  // If the ticket status is active, it should be considered into calculation.
  const activeAccess = active ? 1 : 0;

  // Total number of remaining accesses, including multicarnets
  const accessesRemaining = maximumNumberOfAccesses - numberOfUsedAccesses;

  // If `maximumNumberOfAccesses` are not divisible by `CARNET_DIVIDER`, we need
  // to add some extra dots, in order to not break the active dot position.
  const padding =
    Math.abs(CARNET_DIVIDER - maximumNumberOfAccesses) % CARNET_DIVIDER;

  // Number of additional dots that should be added when the padding is there.
  const numberOfAdditionalDots =
    maximumNumberOfAccesses > CARNET_DIVIDER
      ? CARNET_DIVIDER - padding
      : padding;

  // Determines whether we should add an extra multicarnet, due to the active
  // carnet being the last one in the current set.
  //
  // Should only add extra carnet when:
  // - accessesRemaining is divisible by CARNET_DIVIDER
  // - status is currently active
  const shouldAddExtraMultiCarnet =
    accessesRemaining % CARNET_DIVIDER === 0 && active ? 1 : 0;

  // Calculates the amount of dots showing for the multi-carnet part
  const numberOfMultiCarnets =
    Math.ceil(accessesRemaining / CARNET_DIVIDER - 1) +
    shouldAddExtraMultiCarnet;

  // Calculates the amount of dots showing for the used part
  const numberOfUsedDots =
    (numberOfUsedAccesses + numberOfAdditionalDots - activeAccess) %
    CARNET_DIVIDER;

  // Calculates the amount of dots showing for the unused part
  const numberOfUnusedDots = CARNET_DIVIDER - numberOfUsedDots - activeAccess;

  const multiCarnetArray = Array(numberOfMultiCarnets).fill(CARNET_DIVIDER);
  const unusedArray = Array(numberOfUnusedDots).fill(true);
  const usedArray = Array(numberOfUsedDots).fill(false);

  return {
    accessesRemaining,
    multiCarnetArray,
    unusedArray,
    usedArray,
  };
}
