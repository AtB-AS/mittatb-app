import {Time} from '@atb/assets/svg/mono-icons/time';
import {Info} from '@atb/assets/svg/color/icons/status';
import {ThemeText} from '@atb/components/text';
import {MessageBox} from '@atb/components/message-box';
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
  mustWaitForNextLeg: boolean;
  waitTimeInSeconds: number;
};

const WaitSection: React.FC<WaitDetails> = (wait) => {
  const style = useSectionStyles();
  const {t, language} = useTranslation();
  const waitTime = secondsToDuration(wait.waitTimeInSeconds, language);
  const shortWait = timeIsShort(wait.waitTimeInSeconds);
  const iconColor = useTransportationColor();

  return (
    <View style={style.section}>
      <TripLegDecoration color={iconColor} hasStart={false} hasEnd={false} />
      {shortWait && (
        <TripRow rowLabel={<ThemeIcon svg={Info} />}>
          <MessageBox
            noStatusIcon={true}
            type="info"
            message={t(TripDetailsTexts.trip.leg.wait.messages.shortTime)}
          />
        </TripRow>
      )}
      <TripRow rowLabel={<ThemeIcon svg={Time} fill={iconColor} />}>
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
    marginBottom: theme.spacings.large,
  },
}));
export default WaitSection;
