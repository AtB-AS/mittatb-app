import {EstimatedCall} from '../../../sdk';
import {View, Text} from 'react-native';
import React from 'react';
import {formatToClock} from '../../../utils/date';
import {
  getQuayName,
  getLineNameFromEstimatedCall,
} from '../../TripDetailsModal/utils';
import {StyleSheet} from '../../../theme';

type NearbyResultsProps = {
  departures: EstimatedCall[];
};

const NearbyResults: React.FC<NearbyResultsProps> = ({departures}) => {
  const styles = useResultsStyle();
  return (
    <View style={styles.container}>
      {departures.map(departure => (
        <NearbyResultItem
          key={departure.quay.id + departure.serviceJourney.id}
          departure={departure}
        />
      ))}
    </View>
  );
};
const useResultsStyle = StyleSheet.createThemeHook(theme => ({
  container: {
    padding: theme.sizes.pagePadding,
  },
}));

export default NearbyResults;

type NearbyResultItemProps = {
  departure: EstimatedCall;
};
const NearbyResultItem: React.FC<NearbyResultItemProps> = ({departure}) => {
  const styles = useResultItemStyles();
  return (
    <View style={styles.container}>
      <Text style={styles.time}>
        {formatToClock(departure.aimedDepartureTime)}
      </Text>
      <View>
        <Text>{getLineNameFromEstimatedCall(departure)}</Text>
        <Text>Fra {getQuayName(departure.quay)}</Text>
      </View>
    </View>
  );
};

const useResultItemStyles = StyleSheet.createThemeHook(theme => ({
  container: {
    flexDirection: 'row',
  },
  time: {
    marginRight: 24,
  },
}));
