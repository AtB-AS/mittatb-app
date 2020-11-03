import {secondsBetween, secondsToMinutesShort} from '../../../utils/date';
import React, {useEffect} from 'react';
import {View} from 'react-native';
import colors from '../../../theme/colors';
import {Duration} from '../../../assets/svg/icons/transportation';
import {StyleSheet} from '../../../theme';
import {Leg} from '../../../sdk';
import ThemeText from '../../../components/text';

type WaitRowProps = {
  onCalculateTime(seconds: number): void;
  currentLeg: Leg;
  nextLeg: Leg;
};
export default function WaitRow({
  onCalculateTime,
  currentLeg,
  nextLeg,
}: WaitRowProps) {
  const styles = useWaitStyles();
  const time = secondsBetween(
    currentLeg.expectedEndTime,
    nextLeg.expectedStartTime,
  );

  useEffect(() => {
    onCalculateTime(time);
  }, [time]);

  if (!time) return null;

  return (
    <View style={styles.container}>
      <Duration fill={colors.general.gray200} />
      <ThemeText style={styles.text}>
        Vent i {secondsToMinutesShort(time)}
      </ThemeText>
    </View>
  );
}

const useWaitStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    opacity: 0.6,
    marginLeft: 8,
  },
}));
