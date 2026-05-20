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
import {useTripPatternInfo} from './hooks';
import {differenceInMinutes} from 'date-fns';
import {useTimeLabels} from './hooks';
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
    hasStarted,
    statusTextConfig,
  } = useTripPatternInfo(tripPattern);

  const {
    startTimeLabel: expectedStartTimeLabel,
    endTimeLabel: expectedEndTimeLabel,
  } = useTimeLabels(expectedStartTime, expectedEndTime, includeDayInfo);

  /**
   * If the start time of a trip is in the past (hasStarted), and the
   * includeDayInfo flag is true, we want to include day info in the
   * time label.
   *
   * See documentation in useTimeLabels for details about special
   * handling of the current day.
   */
  const {startTimeLabel: aimedStartTimeLabel, endTimeLabel: aimedEndTimeLabel} =
    useTimeLabels(aimedStartTime, aimedEndTime, hasStarted && includeDayInfo);

  const areTimesEquivalentInMinutes =
    Math.abs(differenceInMinutes(expectedStartTime, aimedStartTime)) < 1 &&
    Math.abs(differenceInMinutes(expectedEndTime, aimedEndTime)) < 1;

  const showAimedTime = !areTimesEquivalentInMinutes;

  const a11yLabel = [
    includeFromToInfo
      ? t(TravelCardTexts.header.fromToInfo.a11yLabel(fromName, toName))
      : undefined,
    statusTextConfig?.text,
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
          {statusTextConfig && (
            <StatusText
              svg={statusTextConfig.svg}
              color={statusTextConfig.color}
              text={statusTextConfig.text}
            />
          )}
          <ThemeText typography="body__m__strong">
            {`${expectedStartTimeLabel} - ${expectedEndTimeLabel}`}
          </ThemeText>
          {!areTimesEquivalentInMinutes && (
            <ThemeText typography="body__s" type="secondary">
              {t(TravelCardTexts.header.originalTime)} {aimedStartTimeLabel} -{' '}
              {aimedEndTimeLabel}
            </ThemeText>
          )}
        </View>

        <View style={styles.durationContainer}>
          <ThemeText
            typography="body__m"
            type="secondary"
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
