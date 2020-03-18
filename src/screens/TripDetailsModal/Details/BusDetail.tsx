import React from 'react';
import {View, StyleSheet} from 'react-native';
import Dash from 'react-native-dash';
import colors from '../../../theme/colors';
import {formatToClock, secondsToDuration} from '../../../utils/date';
import nb from 'date-fns/locale/nb';
import DotIcon from '../../../assets/svg/DotIcon';
import LocationRow from '../LocationRow';
import {TouchableOpacity} from 'react-native-gesture-handler';
import BusLegIcon from '../svg/BusLegIcon';
import {LegDetailProps, DetailScreenNavigationProp} from '.';
import {useNavigation} from '@react-navigation/core';
import {getLineName} from '../utils';

const BusDetail: React.FC<LegDetailProps> = ({leg}) => {
  const navigation = useNavigation<DetailScreenNavigationProp>();

  return (
    <TouchableOpacity
      style={styles.pressable}
      onPress={() => navigation.navigate('Stops', {leg})}
    >
      <Dash
        dashGap={4}
        dashThickness={8}
        dashLength={8}
        dashColor={colors.primary.green}
        style={styles.dash}
        dashStyle={{borderRadius: 50}}
      />
      <View style={styles.container}>
        <LocationRow
          icon={<DotIcon fill={colors.primary.green} />}
          location={leg.fromPlace.name}
          time={formatToClock(leg.aimedStartTime)}
          textStyle={styles.textStyle}
          rowStyle={styles.rowStyle}
        />
        <LocationRow
          icon={<BusLegIcon />}
          location={getLineName(leg)}
          time={secondsToDuration(leg.duration ?? 0, nb)}
          textStyle={[styles.textStyle, styles.activeTextStyle]}
          rowStyle={styles.rowStyle}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pressable: {flexDirection: 'column'},
  container: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  rowStyle: {marginBottom: 24},
  textStyle: {fontSize: 16},
  activeTextStyle: {fontWeight: '600'},
  dash: {
    marginLeft: 87,
    flexDirection: 'column',
    position: 'absolute',
    height: '100%',
  },
});

export default BusDetail;
