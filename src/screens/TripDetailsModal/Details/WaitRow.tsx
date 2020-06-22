import {Leg} from '@entur/sdk';
import {secondsBetween, secondsToMinutesShort} from '../../../utils/date';
import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import colors from '../../../theme/colors';
import {Duration} from '../../../assets/svg/icons/transportation';
import {StyleSheet} from '../../../theme';

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
      <View style={styles.textContainer}>
        <Text style={styles.text}>{secondsToMinutesShort(time)}</Text>
      </View>
      <Duration fill={colors.general.gray200} />
    </View>
  );
}

const useWaitStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
    backgroundColor: theme.background.modal_Level2,
  },
  textContainer: {
    width: 70,
    marginRight: 12,
    alignItems: 'flex-end',
  },
  text: {
    fontSize: 12,
    opacity: 0.6,
  },
}));
