import {ContentHeading} from '@atb/components/content-heading';
import {NearestStopPlaceNode, StopPlace} from '@atb/api/types/departures';
import {StopPlaceItem} from './StopPlaceItem';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import {ScrollView} from 'react-native-gesture-handler';
import {EmptyState} from '@atb/components/empty-state';
import {NearbyTexts, useTranslation} from '@atb/translations';
import {ThemedOnBehalfOf} from '@atb/theme/ThemedAssets';
import {Location} from '@atb/favorites';

export const StopPlaces = ({
  headerText,
  stopPlaces,
  navigateToPlace,
  testID,
  location,
  isLoading,
}: {
  headerText?: string;
  stopPlaces: NearestStopPlaceNode[];
  navigateToPlace: (place: StopPlace) => void;
  testID?: string;
  location?: Location;
  isLoading: boolean;
}) => {
  const {t} = useTranslation();
  const styles = useStyles();
  const noStopPlacesFound = stopPlaces.length === 0 && location && !isLoading;
  return (
    <ScrollView testID={testID} contentContainerStyle={styles.container}>
      {headerText && !noStopPlacesFound && <ContentHeading text={headerText} />}
      {stopPlaces.map((node: NearestStopPlaceNode) => (
        <StopPlaceItem
          key={node.place.id}
          stopPlaceNode={node}
          onPress={navigateToPlace}
          testID={'stopPlaceItem' + stopPlaces.indexOf(node)}
        />
      ))}
      {noStopPlacesFound && (
        <EmptyState
          title={t(NearbyTexts.stateAnnouncements.emptyNearbyLocationsTitle)}
          details={t(
            NearbyTexts.stateAnnouncements.emptyNearbyLocationsDetails,
          )}
          illustrationComponent={
            <ThemedOnBehalfOf
              height={90}
              style={styles.emptyStopPlacesIllustration}
            />
          }
          testID="nearbyLocations"
        />
      )}
    </ScrollView>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    rowGap: theme.spacings.small,
    margin: theme.spacings.medium,
  },
  noStopMessage: {
    marginHorizontal: theme.spacings.large,
  },
  emptyStopPlacesIllustration: {
    marginBottom: theme.spacings.medium,
  },
}));
