import React, {useMemo} from 'react';
import {
  Text,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
  ImageStyle,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import TransportationIcon from '../../components/transportation-icon';
import {EstimatedCall, StopPlaceDetails} from '../../sdk';
import {StyleSheet} from '../../theme';
import {
  formatToClockOrRelativeMinutes,
  isInThePast,
  isSameDay,
  formatToSimpleDate,
  daysBetween,
  isSeveralDays,
} from '../../utils/date';
import {getLineNameFromEstimatedCall} from '../../utils/transportation-names';
import {useNavigation} from '@react-navigation/native';
import {NearbyScreenNavigationProp} from '.';
import {useGeolocationState} from '../../GeolocationContext';
import haversine from 'haversine-distance';
import {DeparturesWithStopLocal, QuayWithDeparturesAndLimits} from './utils';
import MessageBox from '../../message-box';
import insets from '../../utils/insets';
import {WalkingPerson} from '../../assets/svg/icons/transportation';
import TextHiddenSupportPrefix from '../../components/text-hidden-support-prefix';
import {parseISO} from 'date-fns';
import OptionalNextDayLabel from '../../components/optional-day-header';

type NearbyResultsProps = {
  departures: DeparturesWithStopLocal[] | null;
  onShowMoreOnQuay?(quayId: string): void;
  isFetchingMore?: boolean;

  isInitialScreen: boolean;
};

const NearbyResults: React.FC<NearbyResultsProps> = ({
  departures,
  onShowMoreOnQuay,
  isFetchingMore = false,

  isInitialScreen,
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

  if (isInitialScreen) {
    return (
      <View style={styles.container}>
        <Text style={styles.centerText}>
          Søk etter avganger fra holdeplasser eller i nærheten av steder.
        </Text>
      </View>
    );
  }

  if (hasNoQuays(departures)) {
    return (
      <View style={styles.container}>
        <MessageBox type="info">
          <Text>Fant ingen avganger i nærheten</Text>
        </MessageBox>
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
  centerText: {
    textAlign: 'center',
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

function hasNoQuays(departures: DeparturesWithStopLocal[] | null) {
  return (
    departures !== null &&
    (Object.keys(departures).length === 0 ||
      departures.every((deps) => Object.keys(deps.quays).length === 0))
  );
}

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
      <View style={styles.stopContainer}>
        <ItemHeader stop={departures.stop} />

        <LastElement last={styles.quayContainer__withoutBorder}>
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
    const allSameDay = useMemo(
      () => isSeveralDays(items.map((i) => i.expectedDepartureTime)),
      [items],
    );

    if (!items.length) return null;

    return (
      <View key={quay.quay.id} style={styles.quayContainer}>
        <View style={styles.platformHeader}>
          <Text>Plattform {quay.quay.publicCode}</Text>
        </View>
        {items.map((departure, i) => (
          <React.Fragment key={departure.serviceJourney.id}>
            <OptionalNextDayLabel
              departureTime={departure.expectedDepartureTime}
              previousDepartureTime={items[i - 1]?.expectedDepartureTime}
              allSameDay={allSameDay}
            />
            <NearbyResultItem
              departure={departure}
              onPress={onPress}
              style={
                i == items.length - 1 && styles.itemContainer__withoutBorder
              }
            />
          </React.Fragment>
        ))}
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
    <TouchableOpacity
      accessibilityRole="button"
      onPress={onPress}
      hitSlop={insets.symmetric(8, 12)}
    >
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
      {location && (
        <View style={styles.distance}>
          <TextHiddenSupportPrefix prefix="Distanse">
            {humanizeDistance(haversine(location.coords, stop))}
          </TextHiddenSupportPrefix>
          <WalkingPerson width={16} style={styles.distanceIcon} />
        </View>
      )}
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

    const pastStyle = isInThePast(departure.expectedDepartureTime)
      ? styles.itemContainer__isInPast
      : undefined;

    return (
      <View style={pastStyle}>
        <TouchableOpacity
          style={[styles.itemContainer, style]}
          onPress={() => onPress?.(departure)}
        >
          <TextHiddenSupportPrefix prefix="Avgang" style={styles.time}>
            {formatToClockOrRelativeMinutes(departure.expectedDepartureTime)}
          </TextHiddenSupportPrefix>
          <TransportationIcon
            mode={departure.serviceJourney.journeyPattern?.line.transportMode}
            publicCode={
              departure.serviceJourney.journeyPattern?.line.publicCode
            }
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
      </View>
    );
  },
);

const useResultItemStyles = StyleSheet.createThemeHook((theme) => ({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
    marginBottom: 12,
    borderBottomColor: theme.background.level1,
    borderBottomWidth: 1,
  },
  itemContainer__isInPast: {
    opacity: 0.5,
  },
  itemContainer__withoutBorder: {
    marginBottom: 0,
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  distance: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceIcon: {
    marginLeft: 4,
  },
  stopContainer: {
    padding: 12,
    paddingBottom: 0,
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
    minWidth: 50,
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
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
    marginBottom: 20,
    borderBottomColor: theme.background.level1,
    borderBottomWidth: 1,
  },

  quayContainer__withoutBorder: {
    marginBottom: 0,
    paddingBottom: 12,
  },
  quayContainer: {
    marginBottom: 20,
  },
}));

type LastElementProps = {
  last?: StyleProp<ViewStyle | TextStyle | ImageStyle>;
  exceptSingleItems?: boolean;
};
const LastElement: React.FC<LastElementProps> = ({
  children,
  last,
  exceptSingleItems = false,
}) => {
  const num = React.Children.count(children) - 1;
  if (exceptSingleItems && num === 0 && children) {
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
