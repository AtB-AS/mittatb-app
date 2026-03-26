import {Leg} from '@atb/api/types/trips';
import {TripSearchTexts, useTranslation} from '@atb/translations';
import {
  secondsBetween,
  secondsToDuration,
  secondsToMinutes,
} from '@atb/utils/date';
import {ThemeText} from '@atb/components/text';
import {WalkFill} from '@atb/assets/svg/mono-icons/transportation';
import {StyleSheet} from '@atb/theme';
import {
  significantWaitTime,
  significantWalkTime,
} from '@atb/screen-components/travel-details-screens';
import {View} from 'react-native';
import {ThemeIcon} from '@atb/components/theme-icon';

export const FootLeg = ({leg, nextLeg}: {leg: Leg; nextLeg?: Leg}) => {
  const styles = useThemeStyles();
  const showWaitTime = Boolean(nextLeg);
  const {t, language} = useTranslation();
  const waitTimeInSeconds = !nextLeg
    ? 0
    : secondsBetween(leg.expectedEndTime, nextLeg?.expectedStartTime);
  const waitDuration = secondsToDuration(waitTimeInSeconds, language);
  const walkDuration = secondsToDuration(leg.duration ?? 0, language);

  const mustWalk = significantWalkTime(leg.duration);
  const mustWait = showWaitTime && significantWaitTime(waitTimeInSeconds);

  const a11yText =
    mustWalk && mustWait
      ? t(
          TripSearchTexts.results.resultItem.footLeg.walkAndWaitLabel(
            walkDuration,
            waitDuration,
          ),
        )
      : mustWait
        ? t(TripSearchTexts.results.resultItem.footLeg.waitLabel(waitDuration))
        : t(TripSearchTexts.results.resultItem.footLeg.walkLabel(walkDuration));

  return (
    <View style={styles.walkContainer} testID="footLeg">
      <ThemeIcon accessibilityLabel={a11yText} svg={WalkFill} />
      <ThemeText style={styles.walkDuration}>
        {secondsToMinutes(leg.duration)}
      </ThemeText>
    </View>
  );
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  detailsContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  walkContainer: {
    backgroundColor: theme.color.background.neutral[2].background,
    paddingVertical: theme.spacing.small,
    paddingHorizontal: theme.spacing.small,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.border.radius.regular,
  },
  walkDuration: {
    color: theme.color.foreground.dynamic.primary,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.small,
  },
  flexRow: {
    flex: 1,
    flexDirection: 'row',
  },
  legs: {
    flexDirection: 'row',
    gap: theme.spacing.xSmall,
    flexWrap: 'wrap',
  },
}));
