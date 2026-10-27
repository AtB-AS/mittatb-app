import {Leg} from '@atb/api/types/trips';
import {secondsToMinutes} from '@atb/utils/date';
import {ThemeText} from '@atb/components/text';
import {WalkFill} from '@atb/assets/svg/mono-icons/transportation';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {View} from 'react-native';
import {ThemeIcon} from '@atb/components/theme-icon';

export const FootLeg = ({leg}: {leg: Leg}) => {
  const styles = useThemeStyles();
  const {theme} = useThemeContext();
  return (
    <View style={styles.walkContainer} testID="footLeg">
      <ThemeIcon
        svg={WalkFill}
        color={theme.color.transport.walk.foreground.primary}
      />
      <ThemeText style={styles.walkDuration}>
        {secondsToMinutes(leg.duration)}
      </ThemeText>
    </View>
  );
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  walkContainer: {
    backgroundColor: theme.color.transport.walk.background,
    paddingVertical: theme.spacing.small,
    paddingHorizontal: theme.spacing.small,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.border.radius.circle,
  },
  walkDuration: {
    color: theme.color.transport.walk.foreground.primary,
  },
}));
