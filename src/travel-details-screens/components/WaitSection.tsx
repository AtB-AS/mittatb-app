import {Time} from '@atb/assets/svg/mono-icons/time';
import {ThemeText} from '@atb/components/text';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {StyleSheet} from '@atb/theme';
import {TripDetailsTexts, useTranslation} from '@atb/translations';
import {secondsToDuration} from '@atb/utils/date';
import {useTransportationColor} from '@atb/utils/use-transportation-color';
import React from 'react';
import {View} from 'react-native';
import {timeIsShort} from '../utils';
import {TripLegDecoration} from './TripLegDecoration';
import {TripRow} from './TripRow';
import {ThemeIcon} from '@atb/components/theme-icon';

export type WaitDetails = {
  mustWaitForNextLeg: boolean;
  waitTimeInSeconds: number;
};

export const WaitSection: React.FC<WaitDetails> = (wait) => {
  const style = useSectionStyles();
  const {t, language} = useTranslation();
  const waitTime = secondsToDuration(wait.waitTimeInSeconds, language);
  const shortWait = timeIsShort(wait.waitTimeInSeconds);
  const iconColor = useTransportationColor(
    undefined,
    undefined,
    false,
    'secondary',
  ).background;

  return (
    <View style={style.section}>
      <TripLegDecoration color={iconColor} hasStart={false} hasEnd={false} />
      {shortWait && (
        <TripRow>
          <MessageInfoBox
            type="info"
            message={t(TripDetailsTexts.trip.leg.wait.messages.shortTime)}
          />
        </TripRow>
      )}
      <TripRow rowLabel={<ThemeIcon svg={Time} color={iconColor} />}>
        <ThemeText typography="body__secondary" color="secondary">
          {t(TripDetailsTexts.trip.leg.wait.label(waitTime))}
        </ThemeText>
      </TripRow>
    </View>
  );
};
const useSectionStyles = StyleSheet.createThemeHook((theme) => ({
  section: {
    flex: 1,
    marginBottom: theme.spacing.large,
  },
}));
