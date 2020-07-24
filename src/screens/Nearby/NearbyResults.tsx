import React from 'react';
import {
  Text,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
  ImageStyle,
  ActivityIndicator,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import TransportationIcon from '../../components/transportation-icon';
import {EstimatedCall, DeparturesWithStop, StopPlaceDetails} from '../../sdk';
import {StyleSheet} from '../../theme';
import {formatToClock} from '../../utils/date';
import {getLineNameFromEstimatedCall} from '../../utils/transportation-names';
import {useNavigation} from '@react-navigation/native';
import {NearbyScreenNavigationProp} from '.';
import {useGeolocationState} from '../../GeolocationContext';
import haversine from 'haversine-distance';
import {DeparturesWithStopLocal, QuayWithDeparturesAndLimits} from './utils';

type NearbyResultsProps = {
  departures: DeparturesWithStopLocal[] | null;
  onRefresh?(): void;
  onLoadMore?(): void;
  onShowMoreOnQuay?(quayId: string): void;
  isRefreshing?: boolean;
  isFetchingMore?: boolean;
};

const NearbyResults: React.FC<NearbyResultsProps> = ({
  departures,
  onRefresh,
  onLoadMore,
  onShowMoreOnQuay,
  isRefreshing = false,
  isFetchingMore = false,
}) => {
  const styles = useResultsStyle();
  const navigation = useNavigation<NearbyScreenNavigationProp>();
  const onPress = (departure: EstimatedCall) => {
    const {publicCode, name} = getLineNameFromEstimatedCall(departure);
    navigation.navigate('DepartureDetailsModal', {
      title: publicCode ? `${publicCode} ${name}` : name,
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
    <View style={styles.container}>
      {departures.map((item) => (
        <StopDepartures
          key={item.stop.id}
          departures={item}
          onPress={onPress}
          onShowMoreOnQuay={onShowMoreOnQuay}
        />
      ))}
      <FooterLoader isFetchingMore={isFetchingMore} />
    </View>
  );
};
const useResultsStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    paddingHorizontal: theme.sizes.pagePadding,
  },
  noDepartures: {
    alignItems: 'center',
  },
}));

type FooterLoaderProps = {
  isFetchingMore: boolean;
};
function FooterLoader({isFetchingMore}: FooterLoaderProps) {
  if (!isFetchingMore) {
    return null;
  }
  return <ActivityIndicator style={{marginVertical: 20}} />;
}

export default NearbyResults;

type StopDeparturesProps = {
  departures: DeparturesWithStopLocal;
  onPress?(departure: EstimatedCall): void;
  onShowMoreOnQuay?(quayId: string): void;
};
const StopDepartures: React.FC<StopDeparturesProps> = React.memo(
  ({departures, onPress, onShowMoreOnQuay}) => {
    const styles = useResultItemStyles();

    if (!Object.keys(departures.quays).length) {
      return null;
    }

    return (
      <View style={styles.item}>
        <ItemHeader stop={departures.stop} />

        <View>
          <LastElement last={styles.stopContainer__withoutBorder}>
            {Object.values(departures.quays).map((quay) => (
              <QuayResult
                key={quay.quay.id}
                quay={quay}
                onPress={onPress}
                onShowMoreOnQuay={onShowMoreOnQuay}
              />
            ))}
          </LastElement>
        </View>
      </View>
    );
  },
);

type QuayProps = {
  quay: QuayWithDeparturesAndLimits;
  onPress?(departure: EstimatedCall): void;
  onShowMoreOnQuay?(quayId: string): void;
};
const QuayResult: React.FC<QuayProps> = React.memo(
  ({quay, onPress, onShowMoreOnQuay}) => {
    const styles = useResultItemStyles();

    const items = quay.departures.slice(0, quay.showLimit);
    const showShowMoreButton =
      onShowMoreOnQuay && quay.departures.length > quay.showLimit;

    return (
      <View key={quay.quay.id} style={styles.stopContainer}>
        <View style={styles.platformHeader}>
          <Text>Plattform {quay.quay.publicCode}</Text>
        </View>
        <LastElement last={styles.itemContainer__withoutBorder}>
          {items.map((departure) => (
            <NearbyResultItem
              departure={departure}
              onPress={onPress}
              key={departure.serviceJourney.id}
            />
          ))}
        </LastElement>
        {showShowMoreButton && (
          <ShowMoreButton onPress={() => onShowMoreOnQuay!(quay.quay.id)} />
        )}
      </View>
    );
  },
);

type ShowMoreButtonProps = {
  onPress(): void;
};
const ShowMoreButton: React.FC<ShowMoreButtonProps> = ({onPress}) => {
  const style = useShowMoreButtonStyle();
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={style.button}>
        <Text style={style.text}>Vis flere avganger</Text>
      </View>
    </TouchableOpacity>
  );
};
const useShowMoreButtonStyle = StyleSheet.createThemeHook((theme) => ({
  button: {
    alignItems: 'center',
    marginTop: 20,
  },
  text: {
    fontSize: 12,
    textDecorationLine: 'underline',
  },
}));

const ItemHeader: React.FC<{
  stop: StopPlaceDetails;
}> = ({stop}) => {
  const {location} = useGeolocationState();
  const styles = useResultItemStyles();

  return (
    <View style={styles.resultHeader}>
      <Text>{stop.name}</Text>
      <Text>
        {location ? humanizeDistance(haversine(location.coords, stop)) : ''}
      </Text>
    </View>
  );
};

type NearbyResultItemProps = {
  departure: EstimatedCall;
  style?: StyleProp<ViewStyle | TextStyle | ImageStyle>;
  onPress?(departure: EstimatedCall): void;
};
const NearbyResultItem: React.FC<NearbyResultItemProps> = React.memo(
  ({departure, onPress, style}) => {
    const styles = useResultItemStyles();
    const {publicCode, name} = getLineNameFromEstimatedCall(departure);
    return (
      <TouchableOpacity
        style={[styles.itemContainer, style]}
        onPress={() => onPress?.(departure)}
      >
        <Text style={styles.time}>
          {formatToClock(departure.expectedDepartureTime)}
        </Text>
        <TransportationIcon
          mode={departure.serviceJourney.journeyPattern?.line.transportMode}
          publicCode={departure.serviceJourney.journeyPattern?.line.publicCode}
        />
        <View style={styles.textWrapper}>
          <Text style={styles.textContent} numberOfLines={1}>
            {publicCode && (
              <Text style={{fontWeight: 'bold'}}>{publicCode} </Text>
            )}
            {name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  },
);

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
  itemContainer__withoutBorder: {
    marginBottom: 0,
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  item: {
    padding: 12,
    backgroundColor: theme.background.level0,
    borderRadius: 8,
    marginBottom: 12,
  },
  platformHeader: {
    marginBottom: 12,
    color: theme.text.faded,
    fontSize: 12,
  },
  time: {
    width: 50,
    fontSize: 16,
    color: theme.text.primary,
    paddingVertical: 4,
    fontVariant: ['tabular-nums'],
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
    borderBottomColor: theme.background.level1,
    borderBottomWidth: 1,
  },

  stopContainer__withoutBorder: {
    marginBottom: 0,
  },
  stopContainer: {
    marginVertical: 20,
  },
}));

type LastElementProps = {
  last?: StyleProp<ViewStyle | TextStyle | ImageStyle>;
};
const LastElement: React.FC<LastElementProps> = ({children, last}) => {
  const num = React.Children.count(children) - 1;
  if (num === 0 && children) {
    return <>{children}</>;
  }
  return (
    <>
      {React.Children.map(children, (child, i) => {
        if (React.isValidElement(child) && i == num) {
          let previous: StyleProp<ViewStyle | TextStyle | ImageStyle> = [];
          if (hasStyle(child)) {
            previous = Array.isArray(child.style) ? child.style : [child.style];
          }
          return React.cloneElement(child, {
            style: previous.concat(last),
          });
        } else {
          return child;
        }
      })}
    </>
  );
};

type WithStyle = {
  style?: StyleProp<ViewStyle | TextStyle | ImageStyle>;
};
function hasStyle(a: any): a is Required<WithStyle> {
  return 'style' in a;
}

function humanizeDistance(distanceInMeters: number): string {
  if (distanceInMeters >= 1000) {
    return Math.round(distanceInMeters / 1000) + ' km';
  }
  return Math.ceil(distanceInMeters) + 'm';
}
