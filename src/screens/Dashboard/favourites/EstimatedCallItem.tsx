import React from 'react';
import {View} from 'react-native';
import ThemeText from '@atb/components/text';
import {EstimatedCall, Place, Quay} from '@atb/api/types/departures';
import {StyleSheet} from '@atb/theme';
import ToggleFavouriteDeparture from '@atb/screens/Departures/components/ToggleFavouriteDeparture';
import {LineChip} from '@atb/screens/Departures/components/EstimatedCallItem';

type EstimatedCallItemProps = {
  departure: EstimatedCall;
  testID: string;
  quay: Quay;
  stopPlace: Place;
};

export default function EstimatedCallItem({
  departure,
  testID,
  quay,
  stopPlace,
}: EstimatedCallItemProps): JSX.Element {
  const styles = useStyles();

  const line = departure.serviceJourney?.line;
  const lineName = departure.destinationDisplay?.frontText;
  const lineNumber = line?.publicCode;
  return (
    <View style={styles.container}>
      <View style={styles.estimatedCallItem} testID={testID}>
        {line && (
          <LineChip
            publicCode={line.publicCode}
            transportMode={line.transportMode}
            transportSubmode={line.transportSubmode}
            testID={testID}
          ></LineChip>
        )}
        <ThemeText style={styles.lineName} testID={testID + 'Name'}>
          {departure.destinationDisplay?.frontText}
        </ThemeText>
      </View>
      {lineName && lineNumber && (
        <ToggleFavouriteDeparture
          line={{...line, lineNumber: lineNumber, lineName: lineName}}
          quay={quay}
          stop={stopPlace}
        />
      )}
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 30,
  },
  estimatedCallItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lineName: {
    flexGrow: 1,
    flexShrink: 1,
    marginRight: theme.spacings.xLarge,
  },
}));
