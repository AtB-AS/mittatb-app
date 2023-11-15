import {ThemeText} from '@atb/components/text';
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
  header,
  stopPlaces,
  navigateToPlace,
  testID,
  location,
  isLoading,
}: {
  header?: string;
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
    <ScrollView style={styles.container} testID={testID}>
      {header && !noStopPlacesFound && (
        <ThemeText
          style={styles.header}
          type="body__secondary"
          color="secondary"
        >
          {header}
        </ThemeText>
      )}
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
    paddingVertical: theme.spacings.medium,
  },
  header: {
    paddingVertical: theme.spacings.medium,
    paddingHorizontal: theme.spacings.medium * 2,
  },
  noStopMessage: {
    marginHorizontal: theme.spacings.large,
  },
  emptyStopPlacesIllustration: {
    marginBottom: theme.spacings.medium,
  },
}));
