import {Wait} from '@atb/assets/svg/icons/transportation';
import {Info, Warning} from '@atb/assets/svg/situations';
import ThemeText from '@atb/components/text';
import {TinyMessageBox} from '@atb/components/message-box';
import {StyleSheet} from '@atb/theme';
import {TripDetailsTexts, useTranslation} from '@atb/translations';
import {secondsToDuration} from '@atb/utils/date';
import {useTransportationColor} from '@atb/utils/use-transportation-color';
import React from 'react';
import {View} from 'react-native';
import {timeIsShort} from '../Details/utils';
import TripLegDecoration from './TripLegDecoration';
import TripRow from './TripRow';
import ThemeIcon from '@atb/components/theme-icon/theme-icon';

export type WaitDetails = {
  waitAfter: boolean;
  waitSeconds: number;
};

const WaitSection: React.FC<WaitDetails> = (wait) => {
  const style = useSectionStyles();
  const {t, language} = useTranslation();
  const waitTime = secondsToDuration(wait.waitSeconds, language);
  const shortWait = timeIsShort(wait.waitSeconds);
  const iconColor = useTransportationColor();

  return (
    <View style={style.section}>
      <TripLegDecoration color={iconColor} hasStart={false} hasEnd={false} />
      {shortWait && (
        <TripRow rowLabel={<ThemeIcon svg={Info} />}>
          <TinyMessageBox
            type="info"
            message={t(TripDetailsTexts.trip.leg.wait.messages.shortTime)}
          />
        </TripRow>
      )}
      <TripRow rowLabel={<ThemeIcon svg={Wait} fill={iconColor} />}>
        <ThemeText type="body__secondary" color="secondary">
          {t(TripDetailsTexts.trip.leg.wait.label(waitTime))}
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
