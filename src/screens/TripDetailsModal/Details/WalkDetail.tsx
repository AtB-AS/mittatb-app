import React from 'react';
import {View, StyleSheet} from 'react-native';
import Dash from 'react-native-dash';

import colors from '../../../theme/colors';
import {secondsToDuration} from '../../../utils/date';
import nb from 'date-fns/locale/nb';
import WalkingPerson from '../../../assets/svg/WalkingPerson';
import LocationRow from '../LocationRow';
import {LegDetailProps} from '.';

const WalkDetail: React.FC<LegDetailProps> = ({leg}) => {
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
      <LocationRow
        icon={<WalkingPerson fill={colors.general.gray200} />}
        location={'Gå ' + secondsToDuration(leg.duration ?? 0, nb)}
        textStyle={styles.walkTextStyle}
        rowStyle={styles.walkRowStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  dash: {
    marginLeft: 89,
    flexDirection: 'column',
    position: 'absolute',
    height: '100%',
  },
  walkTextStyle: {opacity: 0.6, fontSize: 12},
  walkRowStyle: {
    marginBottom: 24,
    marginTop: 20,
  },
});

export default WalkDetail;
