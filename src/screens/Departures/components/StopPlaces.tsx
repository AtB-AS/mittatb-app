import ThemeText from '@atb/components/text';
import {StopPlace, NearestStopPlaceNode} from '@atb/api/types/departures';
import StopPlaceItem from '@atb/screens/Departures/components/StopPlaceItem';
import React from 'react';
import {StyleSheet, useTheme} from '@atb/theme';
import {ScrollView} from 'react-native-gesture-handler';
import {View} from 'react-native';
import MessageBox from '@atb/components/message-box';

const StopPlaces = ({
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

export const NoStopPlaceMessage = ({
  header,
  notStopPlaceMessage,
}: {
  header: string;
  notStopPlaceMessage: string;
}) => {
  const styles = useStyles();
  const {theme} = useTheme();
  return (
    <View style={styles.container}>
      <ThemeText style={styles.header} type="body__secondary" color="secondary">
        {header}
      </ThemeText>
      <MessageBox type="info" containerStyle={styles.noStopMessage}>
        <ThemeText style={{color: theme.static.status.warning.text}}>
          {notStopPlaceMessage}
        </ThemeText>
      </MessageBox>
    </View>
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

export default StopPlaces;
