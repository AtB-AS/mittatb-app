import React from 'react';
import {RefreshControl, Text, View} from 'react-native';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import RealTimeLocationIcon from '../../components/location-icon/real-time';
import {EstimatedCall} from '../../sdk';
import {StyleSheet} from '../../theme';
import {formatToClock} from '../../utils/date';
import {
  getLineNameFromEstimatedCall,
  getQuayName,
} from '../../utils/transportation-names';
import {useNavigation} from '@react-navigation/native';
import {NearbyScreenNavigationProp} from '.';

type NearbyResultsProps = {
  departures: EstimatedCall[] | null;
  onRefresh?(): void;
  isRefreshing?: boolean;
};

const NearbyResults: React.FC<NearbyResultsProps> = ({
  departures,
  onRefresh,
  isRefreshing = false,
}) => {
  const styles = useResultsStyle();
  const navigation = useNavigation<NearbyScreenNavigationProp>();
  const onPress = (departure: EstimatedCall) => {
    navigation.navigate('DepartureDetailsModal', {
      title: getLineNameFromEstimatedCall(departure),
      serviceJourneyId: departure.serviceJourney.id,
      fromQuayId: departure.quay?.id,
    });
  };

  if (departures !== null && departures.length == 0) {
    return (
      <View style={[styles.container, styles.noDepartures]}>
        <Text>Fant ingen avganger i nærheten</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={departures}
      renderItem={({item}) => (
        <NearbyResultItem departure={item} onPress={onPress} />
      )}
      keyExtractor={(departure) =>
        departure.quay?.id + departure.serviceJourney.id
      }
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    />
  );
};
const useResultsStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    padding: theme.sizes.pagePadding,
  },
  noDepartures: {
    alignItems: 'center',
  },
}));

export default NearbyResults;

type NearbyResultItemProps = {
  departure: EstimatedCall;
  onPress?(departure: EstimatedCall): void;
};
const NearbyResultItem: React.FC<NearbyResultItemProps> = ({
  departure,
  onPress,
}) => {
  const styles = useResultItemStyles();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress?.(departure)}
    >
      <Text style={styles.time}>
        {formatToClock(departure.aimedDepartureTime)}
      </Text>
      <RealTimeLocationIcon
        mode={departure.serviceJourney.journeyPattern?.line.transportMode}
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
    </TouchableOpacity>
  );
};

const useResultItemStyles = StyleSheet.createThemeHook((theme) => ({
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
