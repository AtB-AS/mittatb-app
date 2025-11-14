import {ConsumableSchoolCarnetResponse} from '@atb/modules/ticketing';

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
export function calculateCarnetDisplayData(
  active: boolean,
  maximumNumberOfAccesses: number,
  numberOfUsedAccesses: number,
  schoolCarnetInfo?: ConsumableSchoolCarnetResponse,
) {
  const totalNumberOfAccesses =
    schoolCarnetInfo?.maximumNumberOfAccessesPerDay ?? maximumNumberOfAccesses;

  let totalNumberOfUsedAccesses =
    schoolCarnetInfo?.numberOfUsedAccessesForToday ?? numberOfUsedAccesses;

  // When `nextConsumableDateTime` is set, we should show 0 remaining accesses
  // for today even if the user has used none.
  if (schoolCarnetInfo?.nextConsumableDateTime) {
    totalNumberOfUsedAccesses = totalNumberOfAccesses;
  }

  const carnetDivider =
    totalNumberOfAccesses < CARNET_DIVIDER
      ? totalNumberOfAccesses
      : CARNET_DIVIDER;

  // If the ticket status is active, it should be considered into calculation.
  const activeAccess = active ? 1 : 0;

  // Total number of remaining accesses, including multicarnets
  const accessesRemaining = totalNumberOfAccesses - totalNumberOfUsedAccesses;

  // If `totalNumberOfAccesses` are not divisible by `CARNET_DIVIDER`, we need
  // to add some extra dots, in order to not break the active dot position.
  const padding =
    Math.abs(carnetDivider - totalNumberOfAccesses) % carnetDivider;

  // Number of additional dots that should be added when the padding is there.
  const numberOfAdditionalDots =
    totalNumberOfAccesses > carnetDivider ? carnetDivider - padding : padding;

  // Determines whether we should add an extra multicarnet, due to the active
  // carnet being the last one in the current set.
  //
  // Should only add extra carnet when:
  // - accessesRemaining is divisible by carnetDivider
  // - status is currently active
  const shouldAddExtraMultiCarnet =
    accessesRemaining % carnetDivider === 0 && active ? 1 : 0;

  // Calculates the amount of dots showing for the multi-carnet part. Prevent
  // negative when there are no accesses remaining.
  const numberOfMultiCarnets = Math.max(
    Math.ceil(accessesRemaining / carnetDivider - 1) +
      shouldAddExtraMultiCarnet,
    0,
  );

  // Calculates the amount of dots showing for the used part. We show all as
  // used only if every access has been used, otherwise we "expand the next"
  // multicarnet.
  const numberOfUsedDots =
    accessesRemaining === 0
      ? carnetDivider - activeAccess
      : (totalNumberOfUsedAccesses + numberOfAdditionalDots - activeAccess) %
        carnetDivider;

  // Calculates the amount of dots showing for the unused part
  const numberOfUnusedDots = carnetDivider - numberOfUsedDots - activeAccess;

  const multiCarnetArray = Array(numberOfMultiCarnets).fill(carnetDivider);
  const unusedArray = Array(numberOfUnusedDots).fill(true);
  const usedArray = Array(numberOfUsedDots).fill(false);

  return {
    accessesRemaining,
    multiCarnetArray,
    unusedArray,
    usedArray,
  };
}
