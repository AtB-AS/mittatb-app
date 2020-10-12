import {
  NavigationProp,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import Axios, {AxiosError} from 'axios';
import React, {useCallback, useState} from 'react';
import {ActivityIndicator, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {DetailsModalNavigationProp, DetailsModalStackParams} from '..';
import {getSingleTripPattern} from '../../../api/trips';
import {getAxiosErrorType} from '../../../api/utils';
import {ArrowLeft} from '../../../assets/svg/icons/navigation';
import {Dot} from '../../../assets/svg/icons/other/';
import {
  CurrentLocationArrow,
  MapPointPin,
} from '../../../assets/svg/icons/places';
import LocationIcon from '../../../components/location-icon';
import {FavoriteIcon, useFavorites} from '../../../favorites';
import {LocationWithMetadata} from '../../../favorites/types';
import MessageBox from '../../../message-box';
import Header from '../../../ScreenHeader';
import {Leg, Situation, TripPattern} from '../../../sdk';
import SituationMessage from '../../../situations';
import {StyleSheet} from '../../../theme';
import colors from '../../../theme/colors';
import {flatMap} from '../../../utils/array';
import {formatToClock, missingRealtimePrefix} from '../../../utils/date';
import {getQuayNameFromStartLeg} from '../../../utils/transportation-names';
import usePollableResource from '../../../utils/use-pollable-resource';
import LocationRow from '../LocationRow';
import {CompactMap} from '../Map/CompactMap';
import TransportDetail from './TransportDetail';
import WalkDetail from './WalkDetail';

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
        bounces={false}
      >
        {!tripPattern ? (
          <ActivityIndicator animating={true} size="large" />
        ) : (
          <DetailsContent
            {...passingProps}
            error={error}
            tripPattern={tripPattern}
          />
        )}
      </ScrollView>
    </View>
  );
};

const DetailsContent: React.FC<{
  tripPattern: TripPattern;
  from: LocationWithMetadata;
  to: LocationWithMetadata;
  error: AxiosError | undefined;
}> = ({tripPattern, from, to, error}) => {
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
        {error && (
          <MessageBox
            type="warning"
            containerStyle={styles.messageContainer}
            message={translateError(error)}
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

function translateError(error: AxiosError): string {
  const errorType = getAxiosErrorType(error);
  switch (errorType) {
    case 'network-error':
    case 'timeout':
      return 'Kunne ikke hente ut oppdatering for reiseforslaget grunnet dårlig nettforbindelse.';
    default:
      return 'Kunne ikke hente ut oppdatering for reiseforslaget. Det kan være at reisen har endret seg eller ikke lengre er tilgjengelig.';
  }
}

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
  parentSituations?: Situation[];
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
    paddingRight: theme.spacings.medium,
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
  return usePollableResource<TripPattern | null, AxiosError>(fetchTripPattern, {
    initialValue: initialTripPattern ?? null,
    pollingTimeInSeconds: 60,
    filterError: (err) => !Axios.isCancel(err),
  });
}
