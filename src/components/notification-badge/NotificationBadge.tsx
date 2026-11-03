import {ThemeText} from '@atb/components/text';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {useFontScale} from '@atb/utils/use-font-scale';
import {View} from 'react-native';

type Props = {
  count: number;
};

/**
 * A count badge for drawing attention to something new. Hidden from screen
 * readers, so the parent must include the count in its accessibility label.
 */
export const NotificationBadge = ({count}: Props) => {
  const styles = useStyles();
  const {theme} = useThemeContext();
  const fontScale = useFontScale();
  const size = theme.icon.size.normal * fontScale;

  return (
    <View
      style={[styles.badge, {minWidth: size, height: size}]}
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
    >
      <ThemeText typography="body__xs" color={theme.color.status.error.primary}>
        {count}
      </ThemeText>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  badge: {
    paddingHorizontal: theme.spacing.xSmall,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.border.radius.circle,
    backgroundColor: theme.color.status.error.primary.background,
  },
}));
