import {QuayGroup} from '@atb/api/bff/types';
import {Section} from '@atb/components/sections';
import {useThemeContext} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import haversineDistance from 'haversine-distance';
import {sortBy} from 'lodash';
import React, {Fragment, useEffect, useMemo, useState} from 'react';
import {View} from 'react-native';
import {hasNoGroupsWithDepartures, isValidDeparture} from '../utils';
import {LineItem} from './line';
import {QuayHeaderItem} from './quay-header';
import {Location} from '@atb/modules/favorites';
import {StopPlace} from '@atb/api/types/trips';
import {ServiceJourneyDeparture} from '@atb/screen-components/travel-details-screens';
import {formatDestinationDisplay} from '@atb/screen-components/travel-details-screens';

const LIMIT_SIZE = 5;

export type QuaySectionProps = {
  quayGroup: QuayGroup;
  locationOrStopPlace?: Location | StopPlace;
  lastUpdated?: Date;
  hidden?: Date;
  searchDate: string;
  testID?: string;
  onPressDeparture: (
    items: ServiceJourneyDeparture[],
    activeIndex: number,
  ) => void;
  now: number;
};

export const QuaySection = React.memo(function QuaySection({
  quayGroup,
  locationOrStopPlace,
  lastUpdated,
  searchDate,
  testID,
  onPressDeparture,
  now,
}: QuaySectionProps) {
  const [limit, setLimit] = useState(LIMIT_SIZE);
  const {t} = useTranslation();
  const {theme} = useThemeContext();

  useEffect(() => {
    setLimit(LIMIT_SIZE);
  }, [quayGroup.quay.id]);

  const sorted = useMemo(
    () => sortAndLimit(quayGroup, limit, now),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [quayGroup, limit, lastUpdated, now],
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
            key={
              group.lineInfo?.lineId +
              String(
                formatDestinationDisplay(t, group.lineInfo?.destinationDisplay),
              )
            }
            searchDate={searchDate}
            testID={'lineItem' + i}
            onPressDeparture={onPressDeparture}
            now={now}
          />
        ))}
      </Section>
      <View style={{marginBottom: theme.spacing.medium}} />
    </Fragment>
  );
});

function sortAndLimit(quayGroup: QuayGroup, limit: number, now: number) {
  if (hasNoGroupsWithDepartures([quayGroup], now)) {
    return null;
  }
  const sorted = sortBy(
    quayGroup.group,
    (v) => v.departures.find((d) => isValidDeparture(d, now))?.time,
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
