import {StopPlaceGroup} from '@atb/api/departures/types';
import ScreenReaderAnnouncement from '@atb/components/screen-reader-announcement';
import {ActionItem} from '@atb/components/sections';
import {Location} from '@atb/favorites/types';
import {MessageBox} from '@atb/components/message-box';
import {StyleSheet, useTheme} from '@atb/theme';
import {NearbyTexts, useTranslation} from '@atb/translations';
import {animateNextChange} from '@atb/utils/animation';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import QuaySection from './section-items/quay-section';
import {hasNoGroupsWithDepartures, hasNoQuaysWithDepartures} from './utils';
import {StopPlace} from '@atb/api/types/trips';
import DeparturesTexts from '@atb/translations/screens/Departures';

type DeparturesListProps = {
  departures: StopPlaceGroup[] | null;
  lastUpdated?: Date;
  locationOrStopPlace?: Location | StopPlace;
  isFetchingMore?: boolean;
  isLoading?: boolean;
  error?: string;
  isInitialScreen: boolean;
  showOnlyFavorites: boolean;
  disableCollapsing?: boolean;
  searchDate: string;
};

export default function DeparturesList({
  departures,
  lastUpdated,
  isFetchingMore = false,
  isLoading = false,
  error,
  isInitialScreen,
  locationOrStopPlace,
  showOnlyFavorites,
  disableCollapsing = false,
  searchDate,
}: DeparturesListProps) {
  const styles = useDeparturesListStyle();
  const {t} = useTranslation();

  if (isInitialScreen) {
    return (
      <View style={[styles.container, styles.container__padded]}>
        <MessageBox
          type="info"
          message={t(NearbyTexts.results.messages.initial)}
        />
      </View>
    );
  }

  if (!isLoading && hasNoQuaysWithDepartures(departures)) {
    const message = !showOnlyFavorites
      ? t(DeparturesTexts.message.emptyResult)
      : t(NearbyTexts.results.messages.emptyResultFavorites);
    return (
      <View style={styles.container}>
        <ScreenReaderAnnouncement message={message} />

        <MessageBox type="info" message={message} />
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
              key={item?.stopPlace.id}
              stopPlaceGroup={item}
              locationOrStopPlace={locationOrStopPlace}
              lastUpdated={lastUpdated}
              defaultExpanded={i === 0}
              disableCollapsing={disableCollapsing}
              searchDate={searchDate}
              testID={'stopDeparture' + i}
            />
          ))}
          <FooterLoader isFetchingMore={isFetchingMore} />
        </>
      )}
    </View>
  );
}
const useDeparturesListStyle = StyleSheet.createThemeHook((theme) => ({
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
  locationOrStopPlace?: Location | StopPlace;
  lastUpdated?: Date;
  defaultExpanded?: boolean;
  disableCollapsing?: boolean;
  searchDate: string;
  testID?: string;
};
const StopDepartures = React.memo(function StopDepartures({
  stopPlaceGroup,
  locationOrStopPlace,
  lastUpdated,
  defaultExpanded = false,
  disableCollapsing = false,
  searchDate,
  testID,
}: StopDeparturesProps) {
  const {t} = useTranslation();
  const [expanded, setExpanded] = useState(
    defaultExpanded || disableCollapsing,
  );
  useEffect(
    () => setExpanded(defaultExpanded || disableCollapsing),
    [defaultExpanded, disableCollapsing],
  );

  if (!stopPlaceGroup.quays.length) {
    return null;
  }
  if (hasNoGroupsWithDepartures(stopPlaceGroup.quays)) {
    return null;
  }

  return (
    <View accessibilityState={{expanded}} testID={testID}>
      {!disableCollapsing && (
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
          testID={testID + 'HideAction'}
        />
      )}

      {expanded &&
        stopPlaceGroup.quays.map((quayGroup, i) => (
          <QuaySection
            key={quayGroup.quay.id}
            stop={stopPlaceGroup.stopPlace}
            quayGroup={quayGroup}
            locationOrStopPlace={locationOrStopPlace}
            lastUpdated={lastUpdated}
            searchDate={searchDate}
            testID={'quaySection' + i}
          />
        ))}
    </View>
  );
});
