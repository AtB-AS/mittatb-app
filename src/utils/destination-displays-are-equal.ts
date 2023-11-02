import {DestinationDisplay} from '@atb/api/types/generated/journey_planner_v3_types';

/* NB this is the same function as in the bff. Keep in sync! */
export function destinationDisplaysAreEqual(
  destinationDisplay1: DestinationDisplay | undefined,
  destinationDisplay2: DestinationDisplay | undefined,
) {
  const frontTextIsEqual =
    destinationDisplay1?.frontText === destinationDisplay2?.frontText;
  const via1 = destinationDisplay1?.via || [];
  const via2 = destinationDisplay1?.via || [];
  const viaLengthIsEqual = via1.length === via2.length;
  if (!frontTextIsEqual || !viaLengthIsEqual) {
    return false;
  }
  return !!(destinationDisplay1?.via || []).every((via1Item) =>
    destinationDisplay2?.via?.includes(via1Item),
  ); // doesn't check for same order in via arrays, but should it?
}
