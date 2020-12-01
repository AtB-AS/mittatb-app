import {secondsBetween, secondsToMinutes} from '../../../utils/date';
import React, {useEffect} from 'react';
import {View} from 'react-native';
import {Duration} from '../../../assets/svg/icons/transportation';
import {StyleSheet} from '../../../theme';
import {Leg} from '../../../sdk';
import ThemeText from '../../../components/text';
import {defaultFill} from '../../../utils/transportation-color';
import {useTranslation} from '../../../utils/language';
import {TripDetailsTexts} from '../../../translations';
import dictionary from '../../../translations/dictionary';

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
  const {t} = useTranslation();
  const time = secondsBetween(
    currentLeg.expectedEndTime,
    nextLeg.expectedStartTime,
  );

  useEffect(() => {
    onCalculateTime(time);
  }, [time]);

  if (!time) return null;

  const waitTime = `${secondsToMinutes(time)} ${t(
    dictionary.date.units.short.minute,
  )}`;

  return (
    <View style={styles.container}>
      <Duration fill={defaultFill} />
      <ThemeText type="lead" style={styles.text}>
        {t(TripDetailsTexts.legs.wait.label(waitTime))}
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
    opacity: 0.6,
    marginLeft: theme.spacings.small,
  },
}));
