import haversineDistance from 'haversine-distance';
import sortBy from 'lodash.sortby';
import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import {QuayGroup, StopPlaceGroup} from '../../api/departures/types';
import * as Section from '../../components/sections';
import ThemeText from '../../components/text';
import {Location} from '../../favorites/types';
import MessageBox from '../../message-box';
import {StyleSheet} from '../../theme';
import {NearbyTexts, useTranslation} from '../../translations';
import QuaySection from './section-items/quay-section';
import {hasNoGroupsWithDepartures, hasNoQuaysWithDepartures} from './utils';

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

  if (hasNoQuaysWithDepartures(departures)) {
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
          <QuaySection
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
