import {StopPlaceGroup} from '@atb/api/departures/types';
import {ScreenReaderAnnouncement} from '@atb/components/screen-reader-announcement';
import {ExpandableSectionItem} from '@atb/components/sections';
import {Location} from '@atb/favorites';
import {MessageBox} from '@atb/components/message-box';
import {StyleSheet, useTheme} from '@atb/theme';
import {NearbyTexts, useTranslation} from '@atb/translations';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {hasNoGroupsWithDepartures, hasNoQuaysWithDepartures} from './utils';
import {StopPlace} from '@atb/api/types/trips';
import DeparturesTexts from '@atb/translations/screens/Departures';
import QuaySection, {
  QuaySectionProps,
} from '@atb/departure-list/section-items/quay-section';

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
  onPressDeparture: QuaySectionProps['onPressDeparture'];
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
  onPressDeparture,
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
              onPressDeparture={onPressDeparture}
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
  onPressDeparture: QuaySectionProps['onPressDeparture'];
};
const StopDepartures = React.memo(function StopDepartures({
  stopPlaceGroup,
  locationOrStopPlace,
  lastUpdated,
  defaultExpanded = false,
  disableCollapsing = false,
  searchDate,
  testID,
  onPressDeparture,
}: StopDeparturesProps) {
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
    <View testID={testID}>
      {!disableCollapsing && (
        <ExpandableSectionItem
          transparent
          text={stopPlaceGroup.stopPlace.name}
          textType="body__primary--bold"
          onPress={() => setExpanded(!expanded)}
          initiallyExpanded={defaultExpanded}
          testID={testID + 'HideAction'}
          showIconText={true}
          expanded={expanded}
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
            onPressDeparture={onPressDeparture}
          />
        ))}
    </View>
  );
});
