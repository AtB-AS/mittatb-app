import {
  QuayGroup,
  QuaySectionMode,
  StopPlaceInfo,
} from '@atb/api/departures/types';
import {Section} from '@atb/components/sections';
import {useTheme} from '@atb/theme';
import {NearbyTexts, useTranslation} from '@atb/translations';
import haversineDistance from 'haversine-distance';
import sortBy from 'lodash.sortby';
import React, {Fragment, useEffect, useMemo, useState} from 'react';
import {View} from 'react-native';
import {hasNoGroupsWithDepartures, isValidDeparture} from '../utils';
import {LineItem} from './line';
import {MoreItem} from './more';
import {QuayHeaderItem} from './quay-header';
import {Location} from '@atb/favorites';
import {StopPlace} from '@atb/api/types/trips';
import {ServiceJourneyDeparture} from '@atb/travel-details-screens/types';
import {getDestinationLineName} from '@atb/travel-details-screens/utils';

const LIMIT_SIZE = 5;

export type QuaySectionProps = {
  quayGroup: QuayGroup;
  stop: StopPlaceInfo;
  locationOrStopPlace?: Location | StopPlace;
  lastUpdated?: Date;
  hidden?: Date;
  searchDate: string;
  testID?: string;
  mode?: QuaySectionMode;
  onPressDeparture: (
    items: ServiceJourneyDeparture[],
    activeIndex: number,
  ) => void;
};

export const QuaySection = React.memo(function QuaySection({
  quayGroup,
  stop,
  locationOrStopPlace,
  lastUpdated,
  searchDate,
  testID,
  mode = 'departures',
  onPressDeparture,
}: QuaySectionProps) {
  const [limit, setLimit] = useState(LIMIT_SIZE);
  const {t} = useTranslation();
  const {theme} = useTheme();

  useEffect(() => {
    setLimit(LIMIT_SIZE);
  }, [quayGroup.quay.id]);

  const hasMoreItems = quayGroup.group.length > limit;

  const sorted = useMemo(
    () => sortAndLimit(quayGroup, limit),
    [quayGroup, limit, lastUpdated],
  );

  if (!sorted) {
    return null;
  }

  return (
    <Fragment>
      <Section testID={testID}>
        <QuayHeaderItem
          quay={quayGroup.quay}
          distance={getDistanceInfo(quayGroup, locationOrStopPlace)}
          searchDate={searchDate}
          testID={testID}
        />

        {sorted.map((group, i) => (
          <LineItem
            group={group}
            stop={stop}
            quay={quayGroup.quay}
            key={group.lineInfo?.lineId + String(group.lineInfo?.lineName)}
            searchDate={searchDate}
            testID={'lineItem' + i}
            mode={mode}
            onPressDeparture={onPressDeparture}
          />
        ))}
        {hasMoreItems && mode !== 'frontpage' && (
          <MoreItem
            onPress={() => setLimit(limit + LIMIT_SIZE)}
            text={t(NearbyTexts.results.quayResult.showMoreToggler.text)}
          />
        )}
      </Section>
      <View style={{marginBottom: theme.spacings.medium}} />
    </Fragment>
  );
});

function sortAndLimit(quayGroup: QuayGroup, limit: number) {
  if (hasNoGroupsWithDepartures([quayGroup])) {
    return null;
  }
  const sorted = sortBy(
    quayGroup.group,
    (v) => v.departures.find(isValidDeparture)?.time,
  ).slice(0, limit);
  return sorted;
}

function getDistanceInfo(
  group: QuayGroup,
  locationOrStopPlace?: Location | StopPlace,
): number {
  const pos = {
    lat: group.quay.latitude!,
    lng: group.quay.longitude!,
  };

  // locationOrStopPlace is StopPlace
  if (locationOrStopPlace && 'latitude' in locationOrStopPlace) {
    if (!locationOrStopPlace.latitude || !locationOrStopPlace.longitude) {
      return 0;
    }
    return haversineDistance(
      {
        latitude: locationOrStopPlace.latitude,
        longitude: locationOrStopPlace.longitude,
      },
      pos,
    );
  }

  // locationOrStopPlace is Location
  if (locationOrStopPlace && 'coordinates' in locationOrStopPlace) {
    return haversineDistance(locationOrStopPlace.coordinates, pos);
  }

  return 0;
}
