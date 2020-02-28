import React from 'react';
import {View, StyleSheet} from 'react-native';
import Dash from 'react-native-dash';

import colors from '../../../theme/colors';
import {formatToClock, secondsToDuration} from '../../../utils/date';
import nb from 'date-fns/locale/nb';
import WalkingPerson from '../../../assets/svg/WalkingPerson';
import DotIcon from '../../../assets/svg/DotIcon';
import {LegDetailProps} from './';
import LocationRow from './LocationRow';

const WalkDetail: React.FC<LegDetailProps> = ({leg, isFirst}) => {
  return (
    <View style={styles.container}>
      <Dash
        dashGap={4}
        dashLength={4}
        dashThickness={4}
        dashColor={colors.general.white}
        style={styles.dash}
      />

      {!isFirst ? (
        <LocationRow
          icon={<DotIcon />}
          location={leg.fromPlace.name}
          time={formatToClock(leg.aimedStartTime)}
        />
      ) : (
        <View />
      )}

      <LocationRow
        icon={<WalkingPerson />}
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
  walkTextStyle: {opacity: 0.6, fontSize: 12},
});

export default WalkDetail;
