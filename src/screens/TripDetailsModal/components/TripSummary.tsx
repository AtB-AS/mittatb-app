import React from 'react';
import {View} from 'react-native';
import {
  Duration,
  WalkingPerson,
} from '../../../assets/svg/icons/transportation';
import ThemeText from '../../../components/text';
import ThemeIcon from '../../../components/theme-icon';
import {TripPattern} from '../../../sdk';
import {StyleSheet} from '../../../theme';
import {secondsToDuration} from '../../../utils/date';

const Summary: React.FC<TripPattern> = ({walkDistance, duration}) => {
  const styles = useStyle();
  return (
    <View style={styles.summary}>
      <View style={styles.summaryDetail}>
        <ThemeIcon colorType="faded" style={styles.leftIcon} svg={Duration} />
        <ThemeText color="faded">
          Reisetid: {secondsToDuration(duration)}
        </ThemeText>
      </View>
      <View style={styles.summaryDetail}>
        <ThemeIcon
          colorType="faded"
          style={styles.leftIcon}
          svg={WalkingPerson}
        />
        <ThemeText color="faded">
          Gangavstand: {walkDistance.toFixed()} m
        </ThemeText>
      </View>
    </View>
  );
};
const useStyle = StyleSheet.createThemeHook((theme) => ({
  summary: {
    marginVertical: theme.spacings.medium,
  },
  summaryDetail: {
    padding: theme.spacings.medium,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftIcon: {
    marginRight: theme.spacings.small,
  },
}));
export default Summary;
