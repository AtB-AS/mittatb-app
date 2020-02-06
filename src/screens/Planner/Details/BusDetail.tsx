import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Dash from 'react-native-dash';
import colors from '../../../assets/colors';
import {formatToClock, secondsToDuration} from '../../../utils/date';
import nb from 'date-fns/locale/nb';
import BusFront from '../../../assets/svg/BusFront';
import DotIcon from '../../../assets/svg/DotIcon';
import {LegDetailProps} from './';
import LocationRow from './LocationRow';

const BusDetail: React.FC<LegDetailProps> = ({leg}) => {
  return (
    <View style={styles.container}>
      <Dash
        dashGap={0}
        dashThickness={4}
        dashLength={10}
        dashColor={colors.primary.green}
        style={styles.dash}
      />

      <LocationRow
        icon={<DotIcon fill={colors.primary.green} />}
        location={leg.fromPlace.name}
        time={formatToClock(leg.aimedStartTime)}
      />
      <LocationRow
        icon={<BusFront fill={colors.primary.green} />}
        location={leg.line?.name ?? 'Ukjent'}
        time={
          secondsToDuration(leg.duration ?? 0, nb) +
          ' / ' +
          leg.intermediateQuays.length +
          ' stopp'
        }
        textColor={colors.primary.green}
      />

      <View />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 100,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  dash: {
    marginLeft: 7,
    opacity: 0.6,
    flexDirection: 'column',
    position: 'absolute',
    height: '100%',
  },
});

export default BusDetail;
