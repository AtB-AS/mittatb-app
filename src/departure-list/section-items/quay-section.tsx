import {QuayGroup, StopPlaceInfo} from '@atb/api/departures/types';
import {Section} from '@atb/components/sections';
import {useTheme} from '@atb/theme';
import {NearbyTexts, useTranslation} from '@atb/translations';
import haversineDistance from 'haversine-distance';
import sortBy from 'lodash.sortby';
import React, {Fragment, useEffect, useMemo, useState} from 'react';
import {View} from 'react-native';
import {hasNoGroupsWithDepartures, isValidDeparture} from '../utils';
import LineItem from './line';
import MoreItem from './more';
import QuayHeaderItem from './quay-header';
import {Location} from '@atb/favorites/types';

const LIMIT_SIZE = 5;

type QuaySectionProps = {
  quayGroup: QuayGroup;
  stop: StopPlaceInfo;
  currentLocation?: Location;
  lastUpdated?: Date;
  hidden?: Date;
  searchDate: string;
  testID?: string;
  fromLocation?: Location | undefined;
};

const QuaySection = React.memo(function QuaySection({
  quayGroup,
  stop,
  currentLocation,
  lastUpdated,
  searchDate,
  testID,
  fromLocation,
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
          distance={getDistanceInfo(quayGroup, fromLocation)}
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
          />
        ))}
        {hasMoreItems && (
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
export default QuaySection;

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

function getDistanceInfo(group: QuayGroup, currentLocation?: Location): number {
  const pos = {
    lat: group.quay.latitude!,
    lng: group.quay.longitude!,
  };
  return !currentLocation?.coordinates
    ? 0
    : haversineDistance(currentLocation.coordinates, pos);
}
