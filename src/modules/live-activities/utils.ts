import {TripPattern} from '@atb/api/types/trips';
import {Mode} from '@atb/api/types/generated/journey_planner_v3_types';
import {LiveActivityTexts, TranslateFunction} from '@atb/translations';
import {formatDestinationDisplay} from '@atb/screen-components/travel-details-screens';
import type {
  TransitLiveActivityContentState,
  TransitLiveActivityMode,
} from './types';

const MODES: {[mode in Mode]?: TransitLiveActivityMode} = {
  [Mode.Bus]: 'bus',
  [Mode.Coach]: 'bus',
  [Mode.Trolleybus]: 'bus',
  [Mode.Tram]: 'tram',
  [Mode.Rail]: 'rail',
  [Mode.Metro]: 'rail',
  [Mode.Monorail]: 'rail',
  [Mode.Funicular]: 'rail',
  [Mode.Water]: 'water',
  [Mode.Foot]: 'walk',
};

/**
 * The transport mode the Live Activity renders. Modes without a case of their
 * own fall back to `unknown` rather than to a mode that would show the wrong
 * icon.
 */
export const toLiveActivityMode = (
  mode: Mode | undefined,
): TransitLiveActivityMode => (mode && MODES[mode]) || 'unknown';

/**
 * The state a Live Activity starts in, built from the first leg of the trip the
 * traveller is actually going to board. Undefined for a trip with no transit leg
 * at all — there is nothing to follow there.
 *
 * This is a first cut: it describes getting to the first departure, and says
 * nothing about the rest of the trip. Keeping the activity truthful from there
 * on is the backend's job, pushing updates as the trip progresses.
 */
export const toInitialContentState = (
  t: TranslateFunction,
  tripPattern: TripPattern,
): TransitLiveActivityContentState | undefined => {
  const leg = tripPattern.legs.find((leg) => !!leg.line);
  if (!leg) return undefined;

  const quayName = leg.fromPlace.quay?.name ?? leg.fromPlace.name ?? '';
  const title =
    leg.mode === Mode.Foot
      ? t(LiveActivityTexts.title.walkToQuay(quayName))
      : t(LiveActivityTexts.title.departureFrom(quayName));

  return {
    mode: toLiveActivityMode(leg.mode),
    lineNumber: leg.line?.publicCode ?? '',
    lineName:
      formatDestinationDisplay(t, leg.fromEstimatedCall?.destinationDisplay) ??
      leg.line?.name ??
      '',
    title,
    eventTime: toUnixSeconds(leg.expectedStartTime),
  };
};

/** ActivityKit gets unix seconds, and ticks the clock down from there itself. */
const toUnixSeconds = (time: string) =>
  Math.floor(new Date(time).getTime() / 1000);
