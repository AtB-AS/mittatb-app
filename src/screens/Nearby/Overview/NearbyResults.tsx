import React from 'react';
import {RefreshControl, Text, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import TransportationIcon from '../../../components/transportation-icon';
import {EstimatedCall} from '../../../sdk';
import {StyleSheet} from '../../../theme';
import {formatToClock} from '../../../utils/date';
import {
  getLineNameFromEstimatedCall,
  getQuayName,
} from '../../TripDetailsModal/utils';

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
      <TransportationIcon
        mode={departure.serviceJourney.journeyPattern.line.transportMode}
        isLive={departure.realtime}
      />
      <View style={styles.textWrapper}>
        <Text style={styles.textContent}>
          {getLineNameFromEstimatedCall(departure)}
        </Text>
        <Text style={[styles.textContent, styles.label]}>
          Fra {getQuayName(departure.quay)}
        </Text>
      </View>
    </View>
  );
};

const useResultItemStyles = StyleSheet.createThemeHook(theme => ({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  time: {
    width: 55,
    fontSize: 16,
    fontWeight: '600',
    color: theme.text.primary,
    paddingVertical: 4,
  },
  textContent: {
    fontSize: 16,
  },
  textWrapper: {
    fontSize: 16,
    color: theme.text.primary,
    paddingVertical: 4,
    marginLeft: 10,
  },
  label: {
    fontSize: 12,
  },
}));
