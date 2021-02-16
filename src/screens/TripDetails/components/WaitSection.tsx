import {Wait} from '@atb/assets/svg/icons/transportation';
import {Info} from '@atb/assets/svg/situations';
import ThemeText from '@atb/components/text';
import {TinyMessageBox} from '@atb/message-box';
import {StyleSheet} from '@atb/theme';
import {TripDetailsTexts, useTranslation} from '@atb/translations';
import {secondsToDuration} from '@atb/utils/date';
import {transportationColor} from '@atb/utils/transportation-color';
import React from 'react';
import {View} from 'react-native';
import {timeIsShort} from '../Details/utils';
import TripLegDecoration from './TripLegDecoration';
import TripRow from './TripRow';

export type WaitDetails = {
  waitAfter: boolean;
  waitSeconds: number;
};

const WaitSection: React.FC<WaitDetails> = (wait) => {
  const style = useSectionStyles();
  const {t, language} = useTranslation();
  const WaitTexts = TripDetailsTexts.trip.leg.wait;
  const waitTime = secondsToDuration(wait.waitSeconds, language);
  const shortWait = timeIsShort(wait.waitSeconds);
  return (
    <View style={style.section}>
      <TripLegDecoration
        color={transportationColor()}
        hasStart={false}
        hasEnd={false}
      ></TripLegDecoration>
      {shortWait && (
        <TripRow rowLabel={<Info />}>
          <TinyMessageBox
            type="info"
            message={t(WaitTexts.messages.shortTime)}
          />
        </TripRow>
      )}
      <TripRow rowLabel={<Wait />}>
        <ThemeText type="lead" color="secondary">
          {t(WaitTexts.label(waitTime))}
        </ThemeText>
      </TripRow>
    </View>
  );
};
const useSectionStyles = StyleSheet.createThemeHook((theme) => ({
  section: {
    flex: 1,
    marginVertical: theme.spacings.medium,
  },
}));
export default WaitSection;
