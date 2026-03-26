import {Leg} from '@atb/api/types/trips';
import {TravelCardTexts, useTranslation} from '@atb/translations';
import {secondsToDuration, secondsToMinutes} from '@atb/utils/date';
import {ThemeText} from '@atb/components/text';
import {WalkFill} from '@atb/assets/svg/mono-icons/transportation';
import {StyleSheet} from '@atb/theme';
import {View} from 'react-native';
import {ThemeIcon} from '@atb/components/theme-icon';

export const FootLeg = ({leg}: {leg: Leg}) => {
  const styles = useThemeStyles();
  const {t, language} = useTranslation();
  const walkDuration = secondsToDuration(leg.duration ?? 0, language);

  return (
    <View
      accessibilityLabel={t(TravelCardTexts.legs.foot.a11yLabel(walkDuration))}
      style={styles.walkContainer}
      accessible={true}
      testID="footLeg"
    >
      <ThemeIcon svg={WalkFill} />
      <ThemeText style={styles.walkDuration}>
        {secondsToMinutes(leg.duration)}
      </ThemeText>
    </View>
  );
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
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
}));
