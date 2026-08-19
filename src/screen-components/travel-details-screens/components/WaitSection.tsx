import {Time} from '@atb/assets/svg/mono-icons/time';
import {Unknown, Warning} from '@atb/assets/svg/mono-icons/status';
import {Close} from '@atb/assets/svg/mono-icons/actions';
import {ThemeText} from '@atb/components/text';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {
  Language,
  TranslateFunction,
  TripDetailsTexts,
  useTranslation,
} from '@atb/translations';
import {InterchangeRisk, isShortWaitTime} from '@atb/modules/trip-patterns';
import {secondsToDuration} from '@atb/utils/date';
import React from 'react';
import {View} from 'react-native';
import {DimensionOverrides, NEW_TRIP_DIMENSIONS, TripRow} from './TripRow';
import {ThemeIcon} from '@atb/components/theme-icon';
import {useTransportColor} from '@atb/utils/use-transport-color';

export type WaitDetails = {
  mustWaitForNextLeg: boolean;
  waitTimeInSeconds: number;
  interchangeRisk?: InterchangeRisk;
};

/** Whether the wait between two legs has anything worth showing. */
export function shouldShowWaitSection(wait: WaitDetails): boolean {
  return !!wait.interchangeRisk || wait.mustWaitForNextLeg;
}

/** Where a trip row's content starts, which is what stop place names align to. */
const TRIP_CONTENT_OFFSET =
  (NEW_TRIP_DIMENSIONS.labelWidth ?? 0) +
  (NEW_TRIP_DIMENSIONS.decorationContainerWidth ?? 0);

const ONE_MINUTE_IN_SECONDS = 60;

type WaitMessage = {
  icon: React.ComponentProps<typeof ThemeIcon>['svg'];
  title?: string;
  message: string;
  /** Draws the icon and title in the named emphasis colour. */
  emphasis?: 'info' | 'error';
};

function getWaitMessage(
  waitTimeInSeconds: number,
  t: TranslateFunction,
  language: Language,
): WaitMessage {
  if (!isShortWaitTime(waitTimeInSeconds)) {
    return {
      icon: Time,
      message: t(
        TripDetailsTexts.trip.leg.wait.label(
          secondsToDuration(waitTimeInSeconds, language),
        ),
      ),
    };
  }

  const wholeMinutes = Math.ceil(waitTimeInSeconds / ONE_MINUTE_IN_SECONDS);
  return {
    icon: Warning,
    emphasis: 'info',
    title: t(TripDetailsTexts.trip.leg.wait.messages.shortTime),
    message: t(
      TripDetailsTexts.trip.leg.wait.shortWait(
        secondsToDuration(wholeMinutes * ONE_MINUTE_IN_SECONDS, language),
      ),
    ),
  };
}

export const WaitSection: React.FC<WaitDetails> = (wait) => {
  const style = useSectionStyles();
  const {t, language} = useTranslation();
  const interchange = getInterchangeMessage(wait.interchangeRisk, t);

  return (
    <View style={style.section}>
      {interchange && <WaitMessageRow {...interchange} />}
      {wait.mustWaitForNextLeg && (
        <WaitMessageRow
          {...getWaitMessage(wait.waitTimeInSeconds, t, language)}
        />
      )}
    </View>
  );
};

const WaitMessageRow = ({icon, title, message, emphasis}: WaitMessage) => {
  const style = useSectionStyles();
  const {theme} = useThemeContext();
  const legColor = useTransportColor();

  const emphasisColor = emphasis
    ? theme.color.foreground.emphasis[emphasis]
    : undefined;

  const dimensionOverrides: DimensionOverrides = {
    ...NEW_TRIP_DIMENSIONS,
    labelWidth: TRIP_CONTENT_OFFSET - theme.spacing.small,
    decorationContainerWidth: theme.spacing.small,
  };

  return (
    <TripRow
      dimensionOverrides={dimensionOverrides}
      rowLabel={
        <ThemeIcon
          svg={icon}
          size="large"
          color={emphasisColor ?? legColor.secondary.background}
        />
      }
    >
      <View style={style.message}>
        {title && (
          <ThemeText
            typography="body__s"
            type="secondary"
            color={emphasisColor}
          >
            {title}
          </ThemeText>
        )}
        <ThemeText typography="body__s" type="secondary">
          {message}
        </ThemeText>
      </View>
    </TripRow>
  );
};

function getInterchangeMessage(
  interchangeRisk: InterchangeRisk | undefined,
  t: TranslateFunction,
): WaitMessage | undefined {
  if (interchangeRisk === 'impossible') {
    return {
      icon: Close,
      emphasis: 'error',
      title: t(
        TripDetailsTexts.trip.leg.wait.messages.interchange.impossible.label,
      ),
      message: t(
        TripDetailsTexts.trip.leg.wait.messages.interchange.impossible.message,
      ),
    };
  }
  if (interchangeRisk === 'uncertain') {
    return {
      icon: Unknown,
      emphasis: 'error',
      title: t(
        TripDetailsTexts.trip.leg.wait.messages.interchange.uncertain.label,
      ),
      message: t(
        TripDetailsTexts.trip.leg.wait.messages.interchange.uncertain.message,
      ),
    };
  }
}

const useSectionStyles = StyleSheet.createThemeHook((theme) => ({
  section: {
    flex: 1,
    marginBottom: theme.spacing.large,
  },
  message: {
    rowGap: theme.spacing.xSmall,
  },
}));
