import haversineDistance from 'haversine-distance';
import sortBy from 'lodash.sortby';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, LayoutAnimation, View} from 'react-native';
import {QuayGroup, StopPlaceGroup} from '../../api/departures/types';
import {ActionItem} from '../../components/sections';
import ThemeText from '../../components/text';
import {Location} from '../../favorites/types';
import MessageBox from '../../message-box';
import {StyleSheet} from '../../theme';
import {NearbyTexts, useTranslation} from '../../translations';
import QuaySection from './section-items/quay-section';
import {hasNoGroupsWithDepartures, hasNoQuaysWithDepartures} from './utils';

type NearbyResultsProps = {
  departures: StopPlaceGroup[] | null;
  lastUpdated?: Date;
  currentLocation?: Location;
  isFetchingMore?: boolean;
  error?: string;
  isInitialScreen: boolean;
};

export default function NearbyResults({
  departures,
  lastUpdated,
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
  lastUpdated?: Date;
  defaultExpanded?: boolean;
};
const StopDepartures = React.memo(function StopDepartures({
  stopPlaceGroup,
  currentLocation,
  lastUpdated,
  defaultExpanded = false,
}: StopDeparturesProps) {
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
    <View>
      <ActionItem
        transparent
        text={stopPlaceGroup.stopPlace.name}
        mode="heading-expand"
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setExpanded(!expanded);
        }}
        checked={expanded}
      />

      {expanded &&
        orderedQuays.map(([distance, quayGroup]) => (
          <QuaySection
            key={quayGroup.quay.id}
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
