import haversineDistance from 'haversine-distance';
import sortBy from 'lodash.sortby';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {QuayGroup, StopPlaceGroup} from '../../api/departures/types';
import ScreenReaderAnnouncement from '../../components/screen-reader-announcement';
import {ActionItem} from '../../components/sections';
import ThemeText from '../../components/text';
import {Location} from '../../favorites/types';
import MessageBox from '../../message-box';
import {StyleSheet, useTheme} from '../../theme';
import {NearbyTexts, useTranslation} from '../../translations';
import {animateNextChange} from '../../utils/animation';
import QuaySection from './section-items/quay-section';
import {hasNoGroupsWithDepartures, hasNoQuaysWithDepartures} from './utils';

type NearbyResultsProps = {
  departures: StopPlaceGroup[] | null;
  lastUpdated?: Date;
  currentLocation?: Location;
  isFetchingMore?: boolean;
  isLoading?: boolean;
  error?: string;
  isInitialScreen: boolean;

  showOnlyFavorites: boolean;
};

export default function NearbyResults({
  departures,
  lastUpdated,
  isFetchingMore = false,
  isLoading = false,
  error,
  isInitialScreen,
  currentLocation,

  showOnlyFavorites,
}: NearbyResultsProps) {
  const styles = useResultsStyle();
  const {t} = useTranslation();

  if (isInitialScreen) {
    return (
      <View style={[styles.container, styles.container__padded]}>
        <MessageBox type="info">
          <ThemeText>{t(NearbyTexts.results.messages.initial)}</ThemeText>
        </MessageBox>
      </View>
    );
  }

  if (!isLoading && hasNoQuaysWithDepartures(departures)) {
    const message = !showOnlyFavorites
      ? t(NearbyTexts.results.messages.emptyResult)
      : t(NearbyTexts.results.messages.emptyResultFavorites);
    return (
      <View style={styles.container}>
        <ScreenReaderAnnouncement message={message} />

        <MessageBox type="info">
          <ThemeText>{message}</ThemeText>
        </MessageBox>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error && (
        <View style={styles.container__padded}>
          <ScreenReaderAnnouncement message={error} />
          <MessageBox type="warning" message={error} />
        </View>
      )}

      {departures && (
        <>
          {departures.map((item, i) => (
            <StopDepartures
              key={item.stopPlace.id}
              stopPlaceGroup={item}
              currentLocation={currentLocation}
              lastUpdated={lastUpdated}
              defaultExpanded={i === 0}
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
    paddingHorizontal: theme.spacings.medium,
  },
  container__padded: {
    paddingVertical: theme.spacings.medium,
  },
  centerText: {
    textAlign: 'center',
  },
}));

type FooterLoaderProps = {
  isFetchingMore: boolean;
};
function FooterLoader({isFetchingMore}: FooterLoaderProps) {
  const {theme} = useTheme();

  if (!isFetchingMore) {
    return null;
  }

  return (
    <ActivityIndicator
      color={theme.text.colors.primary}
      style={{marginVertical: 20}}
    />
  );
}

type StopDeparturesProps = {
  stopPlaceGroup: StopPlaceGroup;
  currentLocation?: Location;
  lastUpdated?: Date;
  defaultExpanded?: boolean;
};
const StopDepartures = React.memo(function StopDepartures({
  stopPlaceGroup,
  currentLocation,
  lastUpdated,
  defaultExpanded = false,
}: StopDeparturesProps) {
  const {t} = useTranslation();
  const [expanded, setExpanded] = useState(defaultExpanded);
  useEffect(() => setExpanded(defaultExpanded), [defaultExpanded]);
  if (!stopPlaceGroup.quays.length) {
    return null;
  }
  if (hasNoGroupsWithDepartures(stopPlaceGroup.quays)) {
    return null;
  }
  const orderedQuays = orderAndMapByDistance(
    stopPlaceGroup.quays,
    currentLocation,
  );
  return (
    <View accessibilityState={{expanded}}>
      <ActionItem
        transparent
        text={stopPlaceGroup.stopPlace.name}
        mode="heading-expand"
        onPress={() => {
          animateNextChange();
          setExpanded(!expanded);
        }}
        checked={expanded}
        accessibility={{
          accessibilityHint: t(
            NearbyTexts.results.stops.header[
              expanded ? 'hintHide' : 'hintShow'
            ],
          ),
        }}
      />

      {expanded &&
        orderedQuays.map(([distance, quayGroup]) => (
          <QuaySection
            key={quayGroup.quay.id}
            stop={stopPlaceGroup.stopPlace}
            quayGroup={quayGroup}
            distance={distance}
            lastUpdated={lastUpdated}
          />
        ))}
    </View>
  );
});

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
