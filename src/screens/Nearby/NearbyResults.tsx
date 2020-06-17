import React from 'react';
import {RefreshControl, Text, View} from 'react-native';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import RealTimeLocationIcon from '../../components/location-icon/real-time';
import {EstimatedCall, DeparturesWithStop, StopPlaceDetails} from '../../sdk';
import {StyleSheet} from '../../theme';
import {formatToClock} from '../../utils/date';
import {getLineNameFromEstimatedCall} from '../../utils/transportation-names';
import {useNavigation} from '@react-navigation/native';
import {NearbyScreenNavigationProp} from '.';
import {useGeolocationState} from '../../GeolocationContext';
import haversine from 'haversine-distance';

type NearbyResultsProps = {
  departures: DeparturesWithStop[] | null;
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

  if (departures !== null && Object.keys(departures).length == 0) {
    return (
      <View style={[styles.container, styles.noDepartures]}>
        <Text>Fant ingen avganger i nærheten</Text>
      </View>
    );
  }

  if (departures === null) {
    return null;
  }

  return (
    <FlatList
      style={styles.container}
      data={departures}
      renderItem={({item}) => (
        <StopDepartures departures={item} onPress={onPress} />
      )}
      keyExtractor={(departure) => departure.stop.id}
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

type StopDeparturesProps = {
  departures: DeparturesWithStop;
  onPress?(departure: EstimatedCall): void;
};
const StopDepartures: React.FC<StopDeparturesProps> = ({
  departures,
  onPress,
}) => {
  const styles = useResultItemStyles();

  if (!Object.keys(departures.quays).length) {
    return null;
  }

  return (
    <View style={styles.item}>
      <ItemHeader stop={departures.stop} />

      <View>
        {Object.values(departures.quays).map((quay) => (
          <View key={quay.quay.id}>
            <View style={styles.platformHeader}>
              <Text>Plattform {quay.quay.publicCode}</Text>
            </View>
            {quay.departures.map((departure) => (
              <NearbyResultItem
                departure={departure}
                onPress={onPress}
                key={departure.serviceJourney.id}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const ItemHeader: React.FC<{
  stop: StopPlaceDetails;
}> = ({stop}) => {
  const {location} = useGeolocationState();
  const styles = useResultItemStyles();

  return (
    <View style={styles.resultHeader}>
      <Text>{stop.name}</Text>
      <Text>
        {location ? Math.ceil(haversine(location.coords, stop)) + ' m' : ''}
      </Text>
    </View>
  );
};

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
      style={styles.itemContainer}
      onPress={() => onPress?.(departure)}
    >
      <Text style={styles.time}>
        {formatToClock(departure.expectedDepartureTime)}
      </Text>
      <RealTimeLocationIcon
        mode={departure.serviceJourney.journeyPattern?.line.transportMode}
        isLive={departure.realtime}
      />
      <View style={styles.textWrapper}>
        <Text style={styles.textContent} numberOfLines={1}>
          {getLineNameFromEstimatedCall(departure)}
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
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingBottom: 12,
    marginBottom: 12,
    borderBottomColor: theme.background.level1,
    borderBottomWidth: 1,
  },
  item: {
    padding: 12,
    backgroundColor: theme.background.level0,
    borderRadius: 8,
    marginBottom: 12,
  },
  platformHeader: {
    marginTop: 8,
    marginBottom: 12,
    color: theme.text.faded,
  },
  time: {
    width: 55,
    fontSize: 16,
    fontWeight: '600',
    color: theme.text.primary,
    paddingVertical: 4,
  },
  textContent: {
    flex: 1,
    fontSize: 16,
  },
  textWrapper: {
    flex: 1,
    color: theme.text.primary,
    marginLeft: 10,
    paddingVertical: 4,
  },
  label: {
    fontSize: 12,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 9,
    marginBottom: 9,
    borderBottomColor: theme.background.level1,
    borderBottomWidth: 1,
  },
}));
