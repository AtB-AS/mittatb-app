import React, {useState, useCallback} from 'react';
import {View, ActivityIndicator, Text, Button} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {Leg, TripPattern} from '../../../sdk';
import WalkDetail from './WalkDetail';
import TransportDetail from './TransportDetail';
import {formatToClock, missingRealtimePrefix} from '../../../utils/date';
import LocationRow from '../LocationRow';
import {StyleSheet} from '../../../theme';
import Header from '../../../ScreenHeader';
import {Dot} from '../../../assets/svg/icons/other/';
import {
  CurrentLocationArrow,
  MapPointPin,
} from '../../../assets/svg/icons/places';
import {Close} from '../../../assets/svg/icons/actions';
import colors from '../../../theme/colors';
import {DetailsModalNavigationProp, DetailsModalStackParams} from '..';
import MessageBox from '../../../message-box';
import {UserFavorites, LocationWithMetadata} from '../../../favorites/types';
import LocationIcon from '../../../components/location-icon';
import {FavoriteIcon, useFavorites} from '../../../favorites';
import {getSingleTripPattern} from '../../../api/trips';
import usePollableResource from '../../../utils/use-pollable-resource';
import {getQuayNameFromStartLeg} from '../../../utils/transportation-names';
import {CompactMap} from '../Map/CompactMap';
import BackArrow from '../../../components/map/BackArrow';
import {ArrowLeft, ArrowRight} from '../../../assets/svg/icons/navigation';

// @TODO Firebase config?
const TIME_LIMIT_IN_MINUTES = 3;

export type DetailsRouteParams = {
  tripPatternId: string;
  tripPattern?: TripPattern;
  from: LocationWithMetadata;
  to: LocationWithMetadata;
};

export type DetailScreenRouteProp = RouteProp<
  DetailsModalStackParams,
  'Details'
>;

export type DetailScreenNavigationProp = NavigationProp<
  DetailsModalStackParams
>;

type Props = {
  route: DetailScreenRouteProp;
  navigation: DetailScreenNavigationProp;
};

const TripDetailsModal: React.FC<Props> = (props) => {
  const styles = useDetailsStyle();
  const {
    params: {tripPatternId, tripPattern: initialTripPattern, ...passingProps},
  } = props.route;
  const [tripPattern, , isLoading, error] = useTripPattern(
    tripPatternId,
    initialTripPattern,
  );

  return (
    <View style={styles.container}>
      <Header
        leftButton={{
          onPress: () => props.navigation.goBack(),
          accessible: true,
          accessibilityRole: 'button',
          accessibilityLabel: 'Gå tilbake',
          icon: <ArrowLeft />,
        }}
        title="Reisedetaljer"
        style={{backgroundColor: colors.secondary.cyan}}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        {error && (
          <MessageBox type="warning">
            <Text>
              Kunne ikke hente ut oppdatering for reiseforslaget. Det kan være
              at reisen har endret seg eller ikke lengre er tilgjengelig.
            </Text>
          </MessageBox>
        )}
        {!tripPattern ? (
          <ActivityIndicator animating={true} size="large" />
        ) : (
          <DetailsContent {...passingProps} tripPattern={tripPattern} />
        )}
      </ScrollView>
    </View>
  );
};

const DetailsContent: React.FC<{
  tripPattern: TripPattern;
  from: LocationWithMetadata;
  to: LocationWithMetadata;
}> = ({tripPattern, from, to}) => {
  const styles = useDetailsStyle();
  const {favorites} = useFavorites();

  const [shortTime, setShortTime] = useState(false);
  const flagShortTime = (secondsBetween: number) => {
    if (secondsBetween / 60 <= TIME_LIMIT_IN_MINUTES) {
      setShortTime(true);
    }
  };
  const lastLegIsFoot =
    tripPattern.legs?.length > 0 &&
    tripPattern.legs[tripPattern.legs.length - 1].mode === 'foot';

  const startLeg = tripPattern.legs[0];
  const timeString = (leg: Leg, time: string) => {
    let timeString = formatToClock(time);
    if (leg.mode !== 'foot' && !leg.realtime) {
      timeString = missingRealtimePrefix + timeString;
    }
    return timeString;
  };
  const getIconIfFavorite = (loc: LocationWithMetadata) => {
    if (loc.resultType !== 'favorite') return;
    return (
      <FavoriteIcon favorite={favorites.find((f) => f.id === loc.favoriteId)} />
    );
  };

  const navigation = useNavigation<DetailsModalNavigationProp>();

  return (
    <>
      <CompactMap
        legs={tripPattern.legs}
        onExpand={() => {
          navigation.navigate('DetailsMap', {
            legs: tripPattern.legs,
          });
        }}
      />
      <View style={styles.textDetailsContainer}>
        {shortTime && (
          <MessageBox
            containerStyle={styles.messageContainer}
            message="Vær oppmerksom på kort byttetid."
          />
        )}
        {legIsWalk(startLeg) && (
          <LocationRow
            icon={getLocationIcon(from) ?? <Dot fill={colors.general.black} />}
            label={getQuayNameFromStartLeg(startLeg, from.name)}
            labelIcon={getIconIfFavorite(from)}
            time={timeString(startLeg, tripPattern.startTime)}
            textStyle={styles.textStyle}
          />
        )}
        {tripPattern.legs.map((leg, i, legs) => (
          <LegDetail
            key={i}
            leg={leg}
            onCalculateTime={flagShortTime}
            nextLeg={nextLeg(i, legs)}
            isIntermediateTravelLeg={isIntermediateTravelLeg(i, legs)}
            showFrom={showFrom(i, legs)}
            showTo={showTo(i, legs)}
          />
        ))}
        {lastLegIsFoot && (
          <LocationRow
            icon={getLocationIcon(to)}
            label={to.name}
            labelIcon={getIconIfFavorite(to)}
            time={formatToClock(tripPattern.endTime)}
            textStyle={styles.textStyle}
          />
        )}
      </View>
    </>
  );
};

function getLocationIcon(location: LocationWithMetadata) {
  switch (location.resultType) {
    case 'geolocation':
      return <CurrentLocationArrow />;
    case 'favorite':
    case 'search':
      return <LocationIcon location={location} multiple />;
    default:
      return <MapPointPin fill={colors.general.black} />;
  }
}
function nextLeg(curent: number, legs: Leg[]): Leg | undefined {
  return legs[curent + 1];
}

function isIntermediateTravelLeg(index: number, legs: Leg[]) {
  const next = nextLeg(index, legs);
  if (!next) return false;
  if (next.mode === 'foot') return false;
  return true;
}

function showFrom(index: number, legs: Leg[]) {
  return index > 0 || !legIsWalk(legs?.[0]);
}
function showTo(index: number, legs: Leg[]) {
  return index !== legs.length - 1;
}
function legIsWalk(leg: Leg) {
  return leg?.mode === 'foot';
}

export type LegDetailProps = {
  leg: Leg;
  onCalculateTime(timeInSeconds: number): void;
  nextLeg?: Leg;
  isIntermediateTravelLeg: boolean;
  showFrom: boolean;
  showTo: boolean;
};

const LegDetail: React.FC<LegDetailProps> = (props) => {
  const {leg} = props;
  switch (leg.mode) {
    case 'foot':
      return <WalkDetail {...props} />;
    default:
      return <TransportDetail {...props} />;
  }
};

const useDetailsStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.background.modal_Level2,
  },
  messageContainer: {
    margin: 24,
    marginTop: 0,
  },
  textDetailsContainer: {
    paddingTop: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 100,
  },
  textStyle: {
    fontSize: 16,
  },
}));

export default TripDetailsModal;

function useTripPattern(
  tripPatternId: string,
  initialTripPattern?: TripPattern,
) {
  const fetchTripPattern = useCallback(
    async function reload() {
      return await getSingleTripPattern(tripPatternId);
    },
    [tripPatternId],
  );
  return usePollableResource<TripPattern | null>(fetchTripPattern, {
    initialValue: initialTripPattern ?? null,
    pollingTimeInSeconds: 60,
  });
}
