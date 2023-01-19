import {ThemeText} from '@atb/components/text';
import {StopPlace, NearestStopPlaceNode} from '@atb/api/types/departures';
import {StopPlaceItem} from './StopPlaceItem';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import {ScrollView} from 'react-native-gesture-handler';

export const StopPlaces = ({
  header,
  stopPlaces,
  navigateToPlace,
  testID,
}: {
  header?: string;
  stopPlaces: NearestStopPlaceNode[];
  navigateToPlace: (place: StopPlace) => void;
  testID: string;
}) => {
  const styles = useStyles();
  return (
    <ScrollView style={styles.container} testID={testID}>
      {header && (
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
          key={node?.place?.id}
          stopPlaceNode={node}
          onPress={navigateToPlace}
          testID={'stopPlaceItem' + stopPlaces.indexOf(node)}
        />
      ))}
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
}));
