import React from 'react';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {RouteProp, NavigationProp} from '@react-navigation/native';
import {Leg, TripPattern, Location} from '../../sdk';
import WalkDetail from './WalkDetail';
import BusDetail from './BusDetail';
import {formatToClock} from '../../utils/date';
import LocationRow from './LocationRow';
import DotIcon from '../../assets/svg/DotIcon';
import {StyleSheet} from '../../theme';
import Header from '../../ScreenHeader';
import {RootStackParamList} from '../../navigation';

export type RouteParams = {
  tripPattern: TripPattern;
  from: Location;
  to: Location;
};

type DetailScreenNavigationProp = NavigationProp<RootStackParamList>;
type DetailScreenRouteProp = RouteProp<RootStackParamList, 'TripDetailsModal'>;

type Props = {
  route: DetailScreenRouteProp;
  navigation: DetailScreenNavigationProp;
};

const TripDetailsModal: React.FC<Props> = ({navigation, route}) => {
  const {
    params: {tripPattern, from, to},
  } = route;
  const styles = useDetailsStyle();

  return (
    <View style={styles.container}>
      <Header onClose={() => navigation.goBack()}>Reisedetaljer</Header>
      <ScrollView style={styles.scrollView}>
        <LocationRow
          icon={<DotIcon fill="black" />}
          location={from.name}
          time={formatToClock(tripPattern.startTime)}
        />
        {tripPattern.legs.map((leg, i) => (
          <LegDetail key={i} leg={leg} isFirst={i === 0} />
        ))}
        <LocationRow
          icon={<DotIcon fill="black" />}
          location={to.name}
          time={formatToClock(tripPattern.endTime)}
        />
      </ScrollView>
    </View>
  );
};

export type LegDetailProps = {
  leg: Leg;
  isFirst: boolean;
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
    backgroundColor: theme.background.primary,
  },
  scrollView: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: '#F9F9FA0D',
    padding: 12,
  },
}));

export default TripDetailsModal;
