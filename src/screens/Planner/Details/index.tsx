import React from 'react';
import {View, StyleSheet} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {RouteProp} from '@react-navigation/native';
import {Leg} from '../../../sdk';
import {PlannerStackParams} from '../';
import colors from '../../../theme/colors';
import WalkDetail from './WalkDetail';
import BusDetail from './BusDetail';
import {formatToClock} from '../../../utils/date';
import LocationRow from './LocationRow';
import DotIcon from '../../../assets/svg/DotIcon';

type DetailScreenRouteProp = RouteProp<PlannerStackParams, 'Detail'>;

type Props = {
  route: DetailScreenRouteProp;
};

const Detail: React.FC<Props> = ({
  route: {
    params: {tripPattern, from, to},
  },
}) => {
  return (
    <View style={{flex: 1, backgroundColor: colors.primary.gray}}>
      <ScrollView style={styles.scrollView}>
        <LocationRow
          icon={<DotIcon />}
          location={from.name}
          time={formatToClock(tripPattern.startTime)}
        />
        {tripPattern.legs.map((leg, i) => (
          <LegDetail key={i} leg={leg} isFirst={i === 0} />
        ))}
        <LocationRow
          icon={<DotIcon />}
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

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: '#F9F9FA0D',
    padding: 12,
  },
});

export default Detail;
