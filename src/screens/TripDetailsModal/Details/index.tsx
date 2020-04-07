import React, {useState} from 'react';
import {View, ActivityIndicator} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {Leg, TripPattern} from '../../../sdk';
import WalkDetail from './WalkDetail';
import TransportDetail from './TransportDetail';
import {formatToClock} from '../../../utils/date';
import LocationRow from '../LocationRow';
import DotIcon from '../../../assets/svg/DotIcon';
import {StyleSheet} from '../../../theme';
import Header from '../../../ScreenHeader';
import MapPointIcon from '../../../assets/svg/MapPointIcon';
import colors from '../../../theme/colors';
import {DetailsModalStackParams} from '..';
import MessageBox from '../../../message-box';
import {LocationWithSearchMetadata} from '../../../location-search';
import {UserFavorites} from '../../../favorites/types';
import LocationArrow from '../../../assets/svg/LocationArrow';
import {useFavorites} from '../../../favorites/FavoritesContext';
import LocationIcon from '../../../components/location-icon';
import {FavoriteIcon} from '../../../favorites';

// @TODO Firebase config?
const TIME_LIMIT_IN_MINUTES = 3;

export type DetailsRouteParams = {
  tripPattern: TripPattern;
  from: LocationWithSearchMetadata;
  to: LocationWithSearchMetadata;
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

const TripDetailsModal: React.FC<Props> = props => {
  const styles = useDetailsStyle();
  const {
    params: {tripPattern},
  } = props.route;

  const hasValues = Boolean(tripPattern);

  return (
    <View style={styles.container}>
      <Header onClose={() => props.navigation.goBack()}>Reisedetaljer</Header>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        {hasValues ? (
          <DetailsContent {...props} />
        ) : (
          <ActivityIndicator animating={true} size="large" />
        )}
      </ScrollView>
    </View>
  );
};

const DetailsContent: React.FC<Props> = ({route}) => {
  const {favorites} = useFavorites();
  const styles = useDetailsStyle();
  const {
    params: {tripPattern, from, to},
  } = route;

  const [shortTime, setShortTime] = useState(false);
  const flagShortTime = (secondsBetween: number) => {
    if (secondsBetween / 60 <= TIME_LIMIT_IN_MINUTES) {
      setShortTime(true);
    }
  };

  return (
    <>
      {shortTime && (
        <MessageBox containerStyle={styles.messageContainer}>
          Vær oppmerksom på kort byttetid.
        </MessageBox>
      )}
      <LocationRow
        icon={
          getLocationIcon(from, favorites) ?? (
            <DotIcon fill={colors.general.black} />
          )
        }
        location={from.name}
        time={formatToClock(tripPattern.startTime)}
        textStyle={styles.textStyle}
      />
      {tripPattern.legs.map((leg, i, legs) => (
        <LegDetail
          key={i}
          leg={leg}
          onCalculateTime={flagShortTime}
          nextLeg={nextLeg(i, legs)}
          isIntermediateTravelLeg={isIntermediateTravelLeg(i, legs)}
        />
      ))}
      <LocationRow
        icon={getLocationIcon(to, favorites)}
        location={to.name}
        time={formatToClock(tripPattern.endTime)}
        textStyle={styles.textStyle}
      />
    </>
  );
};

function getLocationIcon(
  location: LocationWithSearchMetadata,
  favorites: UserFavorites,
) {
  switch (location.resultType) {
    case 'geolocation':
      return <LocationArrow />;
    case 'favorite':
      return (
        <FavoriteIcon
          favorite={favorites.find(f => f.id === location.favoriteId)}
        />
      );
    case 'search':
      return <LocationIcon location={location} />;
    default:
      return <MapPointIcon fill={colors.general.black} />;
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

export type LegDetailProps = {
  leg: Leg;
  onCalculateTime(timeInSeconds: number): void;
  nextLeg?: Leg;
  isIntermediateTravelLeg: boolean;
};

const LegDetail: React.FC<LegDetailProps> = props => {
  const {leg} = props;
  switch (leg.mode) {
    case 'foot':
      return <WalkDetail {...props} />;
    default:
      return <TransportDetail {...props} />;
  }
};

const useDetailsStyle = StyleSheet.createThemeHook(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.background.modal_Level2,
  },
  messageContainer: {
    margin: 24,
    marginTop: 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 12,
    paddingBottom: 100,
  },
  textStyle: {
    fontSize: 16,
  },
}));

export default TripDetailsModal;
