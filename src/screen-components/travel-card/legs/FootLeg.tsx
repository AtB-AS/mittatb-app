import {Leg} from '@atb/api/types/trips';
import {secondsToMinutes} from '@atb/utils/date';
import {ThemeText} from '@atb/components/text';
import {WalkFill} from '@atb/assets/svg/mono-icons/transportation';
import {StyleSheet} from '@atb/theme';
import {View} from 'react-native';
import {ThemeIcon} from '@atb/components/theme-icon';

export const FootLeg = ({leg}: {leg: Leg}) => {
  const styles = useThemeStyles();
  return (
    <View style={styles.walkContainer} testID="footLeg">
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
    borderRadius: theme.border.radius.circle,
  },
  walkDuration: {
    color: theme.color.foreground.dynamic.primary,
  },
}));
