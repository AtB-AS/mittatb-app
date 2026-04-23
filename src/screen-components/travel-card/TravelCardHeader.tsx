import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {TravelCardTexts, useTranslation} from '@atb/translations';
import {secondsToDuration, secondsToDurationShort} from '@atb/utils/date';

import React from 'react';
import {AccessibilityProps, View} from 'react-native';
import {TripPattern} from '@atb/api/types/trips';
import {ThemeIcon} from '@atb/components/theme-icon';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {StatusText} from './StatusText';
import {useTripPatternInfo} from './use-trip-pattern-info';
import {differenceInMinutes} from 'date-fns';
import {useTimeLabels} from './utils';
import {useAccessibilityLabelContribution} from '@atb/modules/composite-accessibility';

export const TravelCardHeader: React.FC<
  AccessibilityProps & {
    tripPattern: TripPattern;
    includeDayInfo?: boolean;
    includeFromToInfo?: boolean;
  }
> = ({
  tripPattern,
  includeDayInfo = true,
  includeFromToInfo = true,
  ...accessibilityProps
}) => {
  const styles = useThemeStyles();
  const {t, language} = useTranslation();

  const {
    fromName,
    toName,
    expectedStartTime,
    expectedEndTime,
    aimedStartTime,
    aimedEndTime,
    isInPast,
    status,
  } = useTripPatternInfo(tripPattern);

  const {
    startTimeLabel: expectedStartTimeLabel,
    endTimeLabel: expectedEndTimeLabel,
  } = useTimeLabels(expectedStartTime, expectedEndTime, includeDayInfo);

  const {startTimeLabel: aimedStartTimeLabel, endTimeLabel: aimedEndTimeLabel} =
    useTimeLabels(aimedStartTime, aimedEndTime, isInPast && includeDayInfo);

  const areTimesEquivalentInMinutes =
    differenceInMinutes(expectedStartTime, aimedStartTime) < 1 &&
    differenceInMinutes(expectedEndTime, aimedEndTime) < 1;

  const showAimedTime = !areTimesEquivalentInMinutes || isInPast;

  const a11yLabel = [
    includeFromToInfo
      ? t(TravelCardTexts.header.fromToInfo.a11yLabel(fromName, toName))
      : undefined,
    status?.text,
    t(
      TravelCardTexts.header.expectedTime.a11yLabel(
        expectedStartTimeLabel,
        expectedEndTimeLabel,
        showAimedTime,
      ),
    ),
    showAimedTime
      ? t(
          TravelCardTexts.header.aimedTime.a11yLabel(
            aimedStartTimeLabel,
            aimedEndTimeLabel,
          ),
        )
      : undefined,
    t(
      TravelCardTexts.header.duration.a11yLabel(
        secondsToDuration(tripPattern.duration, language),
      ),
    ),
  ]
    .filter(Boolean)
    .join('. ');

  useAccessibilityLabelContribution('header', a11yLabel);

  return (
    <View style={styles.container} {...accessibilityProps}>
      <View style={styles.header}>
        <View style={styles.timeContainer}>
          {status && (
            <StatusText
              svg={status.svg}
              color={status.color}
              text={status.text}
            />
          )}
          <ThemeText typography="body__m__strong">
            {`${expectedStartTimeLabel} - ${expectedEndTimeLabel}`}
          </ThemeText>
          {(!areTimesEquivalentInMinutes || isInPast) && (
            <ThemeText typography="body__s" color="secondary">
              {t(TravelCardTexts.header.originalTime)} {aimedStartTimeLabel} -{' '}
              {aimedEndTimeLabel}
            </ThemeText>
          )}
        </View>

        <View style={styles.durationContainer}>
          <ThemeText
            typography="body__m"
            color="secondary"
            testID="resultDuration"
          >
            {secondsToDurationShort(tripPattern.duration, language)}
          </ThemeText>
        </View>
      </View>
      {includeFromToInfo && (
        <View style={styles.fromToContainer}>
          <ThemeText typography="body__m">{fromName}</ThemeText>
          <ThemeIcon svg={ArrowRight} />
          <ThemeText typography="body__m">{toName}</ThemeText>
        </View>
      )}
    </View>
  );
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    gap: theme.spacing.small,
  },
  timeContainer: {flex: 1, flexShrink: 1, gap: theme.spacing.xSmall},
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  durationContainer: {
    flexShrink: 0,
    alignItems: 'flex-end',
  },
  fromToContainer: {
    flexDirection: 'row',
    gap: theme.spacing.xSmall,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  warningIcon: {
    marginLeft: theme.spacing.small,
  },
}));
