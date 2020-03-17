import React from 'react';
import {View, StyleSheet} from 'react-native';
import Dash from 'react-native-dash';

import colors from '../../theme/colors';
import {formatToClock, secondsToDuration} from '../../utils/date';
import nb from 'date-fns/locale/nb';
import WalkingPerson from '../../assets/svg/WalkingPerson';
import DotIcon from '../../assets/svg/DotIcon';
import {LegDetailProps} from '.';
import LocationRow from './LocationRow';

const WalkDetail: React.FC<LegDetailProps> = ({leg, isFirst}) => {
  return (
    <View style={styles.container}>
      <Dash
        dashGap={8}
        dashLength={4}
        dashThickness={4}
        dashColor={colors.general.gray200}
        style={styles.dash}
        dashStyle={{borderRadius: 50}}
      />

      {!isFirst ? (
        <LocationRow
          icon={<DotIcon fill={colors.primary.green} />}
          location={leg.fromPlace.name}
          time={formatToClock(leg.aimedStartTime)}
          textStyle={{fontSize: 16}}
        />
      ) : (
        <View />
      )}

      <LocationRow
        icon={<WalkingPerson fill={colors.general.gray200} />}
        location={'Gå ' + Math.floor(leg.distance ?? 0) + ' m'}
        time={secondsToDuration(leg.duration ?? 0, nb)}
        textStyle={styles.walkTextStyle}
      />

      <View />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 68,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  dash: {
    marginLeft: 89,
    flexDirection: 'column',
    position: 'absolute',
    height: '100%',
  },
  walkTextStyle: {opacity: 0.6, fontSize: 12},
});

export default WalkDetail;
