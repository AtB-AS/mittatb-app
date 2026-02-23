import {Location} from '@atb/modules/favorites';
import {TransportModeFilterOptionWithSelectionType} from '@atb/modules/travel-search-filters';
import {
  StreetMode,
  TransportMode,
  TransportModes,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {FeatureCategory} from '@atb/api/bff/types';
import type {TripSearchTime} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/types';
import {
  Language,
  type TranslateFunction,
  TripSearchTexts,
} from '@atb/translations';
import {formatToLongDateTime} from '@atb/utils/date';
import type {DateOptionAndValue} from '@atb/components/date-selection';
import {type TripPatternBookingStatus} from '@atb/screen-components/travel-details-screens';
import type {Leg} from '@atb/api/types/trips';
import {getRealtimeState} from '@atb/utils/realtime';
import {TravelSearchTransportModesType} from '@atb-as/config-specs';
import {enumFromString} from '@atb/utils/enum-from-string';
import {isDefined} from '@atb/utils/presence';
import {ONE_SECOND_MS} from '@atb/utils/durations';

export type TimeSearch = {
  searchTime: DateOptionAndValue<'now' | 'departure' | 'arrival'>;
  cursor?: never;
};

export type CursorSearch = {
  searchTime?: never;
  cursor: string;
};

export type SearchInput = TimeSearch | CursorSearch;

export const defaultJourneyModes = {
  accessMode: StreetMode.Foot,
  directMode: StreetMode.Foot,
  egressMode: StreetMode.Foot,
};

export function transportModeToEnum(
  modes: TravelSearchTransportModesType[],
): TransportModes[] {
  return modes.map((internal) => {
    return {
      transportMode: enumFromString(TransportMode, internal.transportMode),
      transportSubModes: internal.transportSubModes
        ?.map((submode) => enumFromString(TransportSubmode, submode))
        .filter(isDefined),
    };
  });
}

const getDateWithRoundedTime = (milliseconds: number) =>
  new Date(Math.round(new Date().getTime() / milliseconds) * milliseconds);

export const sanitizeSearchTime = (
  searchTime: DateOptionAndValue<'now' | 'departure' | 'arrival'>,
) =>
  searchTime.option === 'now'
    ? {
        ...searchTime,
        date: getDateWithRoundedTime(5 * ONE_SECOND_MS).toISOString(), // round to nearest 5 seconds to avoid unnecessary calls
      }
    : searchTime;

export const areDefaultFiltersSelected = (
  transportModes?: TransportModeFilterOptionWithSelectionType[],
): boolean => {
  if (!transportModes || transportModes.length === 0) return false;
  return transportModes.every((tm) => tm.selectedAsDefault === tm.selected);
};

const isVenue = (location: Location): boolean => {
  return 'layer' in location && location.layer === 'venue';
};

const isGroupOfStopPlaces = (location: Location): boolean => {
  return (
    'category' in location &&
    !!location.category?.length &&
    location.category[0] === FeatureCategory.GROUP_OF_STOP_PLACES
  );
};

export const getSearchPlace = (location?: Location) => {
  if (!location) return undefined;
  return location.resultType === 'search' &&
    (isVenue(location) || isGroupOfStopPlaces(location))
    ? location.id
    : undefined;
};

export function getSearchTimeLabel(
  searchTime: TripSearchTime,
  timeOfLastSearch: string,
  t: TranslateFunction,
  language: Language,
) {
  const date = searchTime.option === 'now' ? timeOfLastSearch : searchTime.date;
  const time = formatToLongDateTime(date, language);

  switch (searchTime.option) {
    case 'now':
      return t(TripSearchTexts.dateInput.departureNow(time));
    case 'arrival':
      return t(TripSearchTexts.dateInput.arrival(time));
    case 'departure':
      return t(TripSearchTexts.dateInput.departure(time));
  }
}

export const getTripPatternBookingText = (
  tripPatternBookingStatus: TripPatternBookingStatus,
  t: TranslateFunction,
) => {
  switch (tripPatternBookingStatus) {
    case 'none':
      return undefined;
    case 'bookable':
      return t(TripSearchTexts.results.resultItem.footer.requiresBooking);
    case 'late':
      return t(TripSearchTexts.results.resultItem.footer.toLateForBooking);
  }
};

export function isSignificantDifference(leg: Leg) {
  return (
    getRealtimeState({
      isRealtime: leg.realtime,
      aimedTime: leg.aimedStartTime,
      expectedTime: leg.expectedStartTime,
    }) === 'significant-difference'
  );
}
