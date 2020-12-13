import haversineDistance from 'haversine-distance';
import React, {Fragment, useEffect, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {QuayGroup, StopPlaceGroup} from '../../api/departures/types';
import * as Section from '../../components/sections';
import ThemeText from '../../components/text';
import {Location} from '../../favorites/types';
import MessageBox from '../../message-box';
import {StyleSheet} from '../../theme';
import {NearbyTexts, useTranslation} from '../../translations';
import LineItem from './section-items/line';
import MoreItem from './section-items/more';
import QuayHeaderItem from './section-items/quay';
import sortBy from 'lodash.sortby';

type NearbyResultsProps = {
  departures: StopPlaceGroup[] | null;
  currentLocation?: Location;
  isFetchingMore?: boolean;
  error?: string;
  isInitialScreen: boolean;
};

export default function NearbyResults({
  departures,
  isFetchingMore = false,
  error,
  isInitialScreen,
  currentLocation,
}: NearbyResultsProps) {
  const styles = useResultsStyle();
  const {t} = useTranslation();

  if (isInitialScreen) {
    return (
      <View style={styles.container}>
        <MessageBox type="info">
          <ThemeText>{t(NearbyTexts.results.messages.initial)}</ThemeText>
        </MessageBox>
      </View>
    );
  }

  if (hasNoQuays(departures)) {
    return (
      <View style={styles.container}>
        <MessageBox type="info">
          <ThemeText>{t(NearbyTexts.results.messages.emptyResult)}</ThemeText>
        </MessageBox>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error && (
        <MessageBox
          type="warning"
          message={error}
          containerStyle={{marginBottom: 24}}
        />
      )}

      {departures && (
        <>
          {departures.map((item) => (
            <StopDepartures
              key={item.stopPlace.id}
              stopPlaceGroup={item}
              currentLocation={currentLocation}
            />
          ))}
          <FooterLoader isFetchingMore={isFetchingMore} />
        </>
      )}
    </View>
  );
}
const useResultsStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    padding: theme.spacings.medium,
  },
  centerText: {
    textAlign: 'center',
  },
}));

type FooterLoaderProps = {
  isFetchingMore: boolean;
};
function FooterLoader({isFetchingMore}: FooterLoaderProps) {
  if (!isFetchingMore) {
    return null;
  }
  return <ActivityIndicator style={{marginVertical: 20}} />;
}

type StopDeparturesProps = {
  stopPlaceGroup: StopPlaceGroup;
  currentLocation?: Location;
};
function StopDepartures({
  stopPlaceGroup,
  currentLocation,
}: StopDeparturesProps) {
  if (!stopPlaceGroup.quays.length) {
    return null;
  }
  if (hasNoGroupsWithDepartures(stopPlaceGroup.quays)) {
    return null;
  }

  return (
    <View>
      <Section.HeaderItem transparent text={stopPlaceGroup.stopPlace.name} />
      {orderAndMapByDistance(stopPlaceGroup.quays, currentLocation).map(
        ([distance, quayGroup]) => (
          <QuayGroupItem
            key={quayGroup.quay.id}
            quayGroup={quayGroup}
            distance={distance}
          />
        ),
      )}
    </View>
  );
}
const first = ([a]: unknown[]) => a;
function orderAndMapByDistance(
  groups: QuayGroup[],
  currentLocation?: Location,
): [number, QuayGroup][] {
  return sortBy(
    groups.map((g) => {
      const pos = {
        lat: g.quay.latitude!,
        lng: g.quay.longitude!,
      };
      const distance = !currentLocation
        ? 0
        : haversineDistance(currentLocation.coordinates, pos);
      return [distance, g];
    }),
    first,
  );
}

const LIMIT_SIZE = 5;

function QuayGroupItem({
  quayGroup,
  distance,
}: {
  quayGroup: QuayGroup;
  distance?: number;
}) {
  const [limit, setLimit] = useState(LIMIT_SIZE);
  const {t} = useTranslation();

  useEffect(() => {
    setLimit(LIMIT_SIZE);
  }, [quayGroup.quay.id]);

  if (hasNoGroupsWithDepartures([quayGroup])) {
    return null;
  }
  return (
    <Fragment>
      <Section.Section>
        <QuayHeaderItem quay={quayGroup.quay} distance={distance} />

        {quayGroup.group.slice(0, limit).map((group) => (
          <LineItem
            group={group}
            key={group.lineInfo?.lineId + String(group.lineInfo?.lineName)}
          />
        ))}
        {quayGroup.group.length > limit && (
          <MoreItem
            onPress={() => setLimit(limit + LIMIT_SIZE)}
            text={t(NearbyTexts.results.quayResult.showMoreToggler.text)}
          />
        )}
      </Section.Section>
      <View style={{marginBottom: 12}} />
    </Fragment>
  );
}

function hasNoQuays(departures: StopPlaceGroup[] | null) {
  return (
    departures !== null &&
    (departures.length === 0 ||
      departures.every((deps) => deps.quays.length === 0))
  );
}
function hasNoGroupsWithDepartures(departures: QuayGroup[]) {
  return departures.every((q) => !q.group.some((g) => g.departures.length));
}
