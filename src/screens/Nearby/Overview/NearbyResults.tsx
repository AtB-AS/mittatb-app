import {EstimatedCall} from '../../../sdk';
import {View, Text, RefreshControl} from 'react-native';
import React from 'react';
import {formatToClock} from '../../../utils/date';
import {
  getQuayName,
  getLineNameFromEstimatedCall,
} from '../../TripDetailsModal/utils';
import {StyleSheet} from '../../../theme';
import {FlatList} from 'react-native-gesture-handler';

type NearbyResultsProps = {
  departures: EstimatedCall[];
  onRefresh?(): void;
  isRefreshing?: boolean;
};

const NearbyResults: React.FC<NearbyResultsProps> = ({
  departures,
  onRefresh,
  isRefreshing = false,
}) => {
  const styles = useResultsStyle();

  return (
    <FlatList
      style={styles.container}
      data={departures}
      renderItem={({item}) => <NearbyResultItem departure={item} />}
      keyExtractor={departure =>
        departure.quay.id + departure.serviceJourney.id
      }
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    />
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
