import {Time as TimeIcon} from '@atb/assets/svg/mono-icons/time';
import {ThemeText} from '@atb/components/text';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {StyleSheet} from '@atb/theme';
import {TripDetailsTexts, useTranslation} from '@atb/translations';
import {isShortWaitTime} from '@atb/modules/trip-patterns';
import {secondsToDuration} from '@atb/utils/date';
import React from 'react';
import {View} from 'react-native';
import {LegacyTripLegDecoration} from './TripLegDecoration';
import {TripRow} from '../components/TripRow';
import {ThemeIcon} from '@atb/components/theme-icon';
import {useTransportColor} from '@atb/utils/use-transport-color';

export type WaitDetails = {
  mustWaitForNextLeg: boolean;
  waitTimeInSeconds: number;
};

export const LegacyWaitSection: React.FC<WaitDetails> = (wait) => {
  const style = useSectionStyles();
  const {t, language} = useTranslation();
  const waitTime = secondsToDuration(wait.waitTimeInSeconds, language);
  const shortWait = isShortWaitTime(wait.waitTimeInSeconds);
  const legColor = useTransportColor();

  return (
    <View style={style.section}>
      <LegacyTripLegDecoration
        color={legColor.secondary.background}
        hasStart={false}
        hasEnd={false}
      />
      {shortWait && (
        <TripRow>
          <MessageInfoBox
            type="info"
            message={t(TripDetailsTexts.trip.leg.wait.messages.shortTime)}
          />
        </TripRow>
      )}
      <TripRow
        rowLabel={
          <ThemeIcon svg={TimeIcon} color={legColor.secondary.background} />
        }
      >
        <ThemeText typography="body__s" type="secondary">
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
