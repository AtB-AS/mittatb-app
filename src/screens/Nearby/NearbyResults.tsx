import {useNavigation} from '@react-navigation/native';
import haversine from 'haversine-distance';
import React, {useMemo} from 'react';
import {
  ActivityIndicator,
  ImageStyle,
  StyleProp,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {NearbyScreenNavigationProp} from '.';
import {Expand} from '../../assets/svg/icons/navigation';
import {WalkingPerson} from '../../assets/svg/icons/transportation';
import OptionalNextDayLabel from '../../components/optional-day-header';
import AccessibleText from '../../components/accessible-text';
import TransportationIcon from '../../components/transportation-icon';
import {useGeolocationState} from '../../GeolocationContext';
import MessageBox from '../../message-box';
import {EstimatedCall, StopPlaceDetails} from '../../sdk';
import SituationMessages, {SituationWarningIcon} from '../../situations';
import {StyleSheet} from '../../theme';
import {flatMap} from '../../utils/array';
import {
  formatToClockOrRelativeMinutes,
  isInThePast,
  isSeveralDays,
  missingRealtimePrefix,
} from '../../utils/date';
import insets from '../../utils/insets';
import {getLineNameFromEstimatedCall} from '../../utils/transportation-names';
import {DeparturesWithStopLocal, QuayWithDeparturesAndLimits} from './utils';
import Text from '../../components/text';
import ThemeIcon from '../../components/themed-icon';

type NearbyResultsProps = {
  departures: DeparturesWithStopLocal[] | null;
  onShowMoreOnQuay?(quayId: string): void;
  isFetchingMore?: boolean;
  error?: string;
  isInitialScreen: boolean;
};

const NearbyResults: React.FC<NearbyResultsProps> = ({
  departures,
  onShowMoreOnQuay,
  isFetchingMore = false,
  error,
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
        <MessageBox type="info">
          <Text>
            Søk etter avganger fra holdeplasser eller i nærheten av steder.
          </Text>
        </MessageBox>
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

  return (
    <View style={styles.container}>
      {error && (
        <MessageBox
          type="warning"
          message={error}
          containerStyle={{marginBottom: 24}}
        />
      )}

      {departures && (
        <>
          {departures.map((item) => (
            <StopDepartures
              key={item.stop.id}
              departures={item}
              onPress={onPress}
              onShowMoreOnQuay={onShowMoreOnQuay}
            />
          ))}
          <FooterLoader isFetchingMore={isFetchingMore} />
        </>
      )}
    </View>
  );
};
const useResultsStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    padding: theme.spacings.medium,
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
    const quays = Object.values(departures.quays);
    if (!quays.length) {
      return null;
    }

    return (
      <>
        <ItemHeader stop={departures.stop} />
        <SituationMessages
          situations={flatMap(quays, (q) => q.quay.situations)}
          containerStyle={styles.situationContainer}
        />
        <LastElement last={styles.quayContainer__withoutBorder}>
          {quays.map((quay) => (
            <QuayResult
              key={quay.quay.id}
              quay={quay}
              onPress={onPress}
              onShowMoreOnQuay={onShowMoreOnQuay}
            />
          ))}
        </LastElement>
      </>
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
            <NearbyResultItem departure={departure} onPress={onPress} />
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
      <View style={style.showMoreButton}>
        <Text style={style.text}>Vis flere avganger</Text>
        <ThemeIcon svg={Expand} />
      </View>
    </TouchableOpacity>
  );
};
const useShowMoreButtonStyle = StyleSheet.createThemeHook((theme) => ({
  showMoreButton: {
    padding: theme.spacings.medium,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: theme.text.sizes.body,
  },
}));

const ItemHeader: React.FC<{
  stop: StopPlaceDetails;
}> = ({stop}) => {
  const {location} = useGeolocationState();
  const styles = useResultItemStyles();

  return (
    <View style={styles.resultHeader}>
      <Text style={styles.resultHeaderText}>{stop.name}</Text>
      {location && (
        <View style={styles.distance}>
          <AccessibleText prefix="Distanse">
            {humanizeDistance(haversine(location.coords, stop))}
          </AccessibleText>
          <ThemeIcon
            svg={WalkingPerson}
            width={16}
            style={styles.distanceIcon}
          />
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
          <TransportationIcon
            mode={departure.serviceJourney.journeyPattern?.line.transportMode}
            publicCode={
              departure.serviceJourney.journeyPattern?.line.publicCode
            }
            circleStyle={{margin: 0}}
          />
          <View style={styles.textWrapper}>
            <Text style={styles.textContent} numberOfLines={1}>
              {publicCode && (
                <Text style={{fontWeight: 'bold'}}>{publicCode} </Text>
              )}
              {name}
            </Text>
          </View>
          <SituationWarningIcon situations={departure.situations} />

          <AccessibleText prefix="Avgang" style={styles.time}>
            {(!departure.realtime ? missingRealtimePrefix : '') +
              formatToClockOrRelativeMinutes(departure.expectedDepartureTime)}
          </AccessibleText>
        </TouchableOpacity>
      </View>
    );
  },
);

const useResultItemStyles = StyleSheet.createThemeHook((theme) => ({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacings.medium,
    borderBottomColor: theme.background.level1,
    borderBottomWidth: 1,
    fontSize: 40,
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
  situationContainer: {
    marginBottom: theme.spacings.small,
  },
  platformHeader: {
    padding: theme.spacings.medium,
    color: theme.text.colors.faded,
    fontSize: theme.text.sizes.label,
    borderBottomColor: theme.background.level1,
    borderBottomWidth: 1,
  },
  time: {
    width: 78,
    textAlign: 'right',
    fontSize: theme.text.sizes.body,
    color: theme.text.colors.primary,
    fontWeight: 'bold',
    paddingVertical: theme.spacings.xSmall,
    marginRight: theme.spacings.small,
    fontVariant: ['tabular-nums'],
  },
  textContent: {
    fontSize: theme.text.sizes.body,
  },
  textWrapper: {
    flex: 1,
    color: theme.text.colors.primary,
    marginLeft: 10,
    paddingVertical: theme.spacings.xSmall,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacings.small,
    padding: theme.spacings.medium,
    borderBottomColor: theme.background.level1,
    borderBottomWidth: 1,
  },
  resultHeaderText: {
    fontSize: theme.text.sizes.body,
    lineHeight: theme.text.lineHeight.body,
    fontWeight: 'bold',
    color: theme.text.colors.primary,
  },

  quayContainer__withoutBorder: {
    marginBottom: 0,
    paddingBottom: 0,
  },
  quayContainer: {
    backgroundColor: theme.background.level0,
    borderRadius: 8,
    marginBottom: theme.spacings.small,
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
