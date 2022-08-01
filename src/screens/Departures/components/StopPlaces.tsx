import ThemeText from '@atb/components/text';
import {Place, StopPlacePosition} from '@atb/api/types/departures';
import StopPlaceItem from '@atb/screens/Departures/components/StopPlaceItem';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import {ScrollView} from 'react-native-gesture-handler';

const StopPlaces = ({
  header,
  stopPlaces,
  navigateToPlace,
  testID,
}: {
  header?: string;
  stopPlaces: StopPlacePosition[];
  navigateToPlace: (place: Place) => void;
  testID: string;
}) => {
  const styles = useStyles();
  return (
    <ScrollView style={styles.container} testID={testID}>
      {header && (
        <ThemeText
          style={styles.listDescription}
          type="body__secondary"
          color="secondary"
        >
          {header}
        </ThemeText>
      )}
      {stopPlaces.map((stopPlacePosition: StopPlacePosition) => (
        <StopPlaceItem
          key={stopPlacePosition.node?.place?.id}
          stopPlacePosition={stopPlacePosition}
          onPress={navigateToPlace}
          testID={'stopPlaceItem' + stopPlaces.indexOf(stopPlacePosition)}
        />
      ))}
    </ScrollView>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    paddingVertical: theme.spacings.medium,
  },
  listDescription: {
    paddingVertical: theme.spacings.medium,
    paddingHorizontal: theme.spacings.medium * 2,
  },
}));

export default StopPlaces;
