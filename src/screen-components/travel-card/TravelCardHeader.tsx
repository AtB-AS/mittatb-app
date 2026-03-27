import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {TravelCardTexts, useTranslation} from '@atb/translations';
import {secondsToDuration, secondsToDurationShort} from '@atb/utils/date';

import React from 'react';
import {View} from 'react-native';
import {TripPattern} from '@atb/api/types/trips';
import {ThemeIcon} from '@atb/components/theme-icon';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {useTripPatternInfo} from './use-trip-pattern-info';
import {differenceInMinutes} from 'date-fns';
import {useTimeLabels} from './utils';
import {useAccessibilityLabelContribution} from '@atb/modules/composite-accessibility';

export const TravelCardHeader: React.FC<{
  tripPattern: TripPattern;
  includeDayInfo?: boolean;
  includeFromToInfo?: boolean;
}> = ({tripPattern, includeDayInfo = true, includeFromToInfo = true}) => {
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

  const a11yLabel = `
    ${includeFromToInfo ? t(TravelCardTexts.header.fromToInfo.a11yLabel(fromName, toName)) : ''}. 
    ${
      isInPast
        ? t(TravelCardTexts.header.pastTime)
        : t(
            TravelCardTexts.header.expectedTime.a11yLabel(
              expectedStartTimeLabel,
              expectedEndTimeLabel,
            ),
          )
    }. 
    ${
      showAimedTime
        ? t(
            TravelCardTexts.header.aimedTime.a11yLabel(
              aimedStartTimeLabel,
              aimedEndTimeLabel,
            ),
          )
        : ''
    }. 
    ${t(
      TravelCardTexts.header.duration.a11yLabel(
        secondsToDuration(tripPattern.duration, language),
      ),
    )}.`;

  useAccessibilityLabelContribution('header', a11yLabel);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.timeContainer}>
          <ThemeText typography="body__m__strong">
            {isInPast
              ? t(TravelCardTexts.header.pastTime)
              : `${expectedStartTimeLabel} - ${expectedEndTimeLabel}`}
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
