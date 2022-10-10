import {
  QuayGroup,
  QuaySectionMode,
  StopPlaceInfo,
} from '@atb/api/departures/types';
import {Section} from '@atb/components/sections';
import {StyleSheet, useTheme} from '@atb/theme';
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
import {StopPlace} from '@atb/api/types/trips';

const LIMIT_SIZE = 5;

type QuaySectionProps = {
  quayGroup: QuayGroup;
  stop: StopPlaceInfo;
  locationOrStopPlace?: Location | StopPlace;
  lastUpdated?: Date;
  hidden?: Date;
  searchDate: string;
  testID?: string;
  mode?: QuaySectionMode;
};

const QuaySection = React.memo(function QuaySection({
  quayGroup,
  stop,
  locationOrStopPlace: currentLocation,
  lastUpdated,
  searchDate,
  testID,
  mode = 'departures',
}: QuaySectionProps) {
  const [limit, setLimit] = useState(LIMIT_SIZE);
  const {t} = useTranslation();
  const {theme} = useTheme();
  const styles = useStyles();

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
      <Section testID={testID} style={styles.quaySection}>
        <QuayHeaderItem
          quay={quayGroup.quay}
          distance={getDistanceInfo(quayGroup, currentLocation)}
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

const useStyles = StyleSheet.createThemeHook((theme) => ({
  quaySection: {
    backgroundColor: theme.static.background.background_1.background,
    borderRadius: theme.border.radius.regular,
  },
}));
