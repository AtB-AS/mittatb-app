import React, {useState} from 'react';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {Leg, TripPattern, Location} from '../../../sdk';
import WalkDetail from './WalkDetail';
import BusDetail from './BusDetail';
import {formatToClock} from '../../../utils/date';
import LocationRow from '../LocationRow';
import DotIcon from '../../../assets/svg/DotIcon';
import {StyleSheet} from '../../../theme';
import Header from '../../../ScreenHeader';
import MapPointIcon from '../../../assets/svg/MapPointIcon';
import colors from '../../../theme/colors';
import {DetailsModalStackParams} from '..';
import MessageBox from '../../../message-box';

// @TODO Firebase config?
const TIME_LIMIT_IN_MINUTES = 4;

export type DetailsRouteParams = {
  tripPattern: TripPattern;
  from: Location;
  to: Location;
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

const TripDetailsModal: React.FC<Props> = ({navigation, route}) => {
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
    <View style={styles.container}>
      <Header onClose={() => navigation.goBack()}>Reisedetaljer</Header>
      <ScrollView style={styles.scrollView}>
        {shortTime && (
          <MessageBox containerStyle={styles.messageContainer}>
            Vær oppmerksom på kort byttetid.
          </MessageBox>
        )}
        <LocationRow
          icon={<DotIcon fill={colors.general.black} />}
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
          icon={<MapPointIcon fill={colors.general.black} />}
          location={to.name}
          time={formatToClock(tripPattern.endTime)}
          textStyle={styles.textStyle}
        />
      </ScrollView>
    </View>
  );
};

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
    case 'bus':
      return <BusDetail {...props} />;
    case 'tram':
      return <BusDetail {...props} />;
    default:
      return <WalkDetail {...props} />;
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
    borderTopWidth: 1,
    borderTopColor: '#F9F9FA0D',
    padding: 12,
  },
  textStyle: {
    fontSize: 16,
  },
}));

export default TripDetailsModal;
