import {StyleSheet} from '@atb/theme';
import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {ThemeText} from '../text';
import {NotificationBadge} from '../notification-badge';
import {useTranslation} from '@atb/translations';
import {NotificationBadgeTexts} from '@atb/translations/components/NotificationBadge';

type ContentHeadingProps = {
  text: string;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  /** Shows a notification badge with this count at the end of the heading */
  notificationCount?: number;
};

export function ContentHeading({
  text,
  accessibilityLabel,
  style,
  notificationCount,
}: ContentHeadingProps): React.JSX.Element {
  const styles = useStyles();
  const {t} = useTranslation();

  return (
    <View
      style={[styles.container, style]}
      accessible
      accessibilityRole="header"
      accessibilityLabel={
        notificationCount
          ? `${accessibilityLabel ?? text} ${t(NotificationBadgeTexts.a11yLabel(notificationCount))}`
          : undefined
      }
    >
      <ThemeText
        typography="body__s"
        type="secondary"
        accessibilityLabel={accessibilityLabel}
        style={styles.text}
      >
        {text}
      </ThemeText>
      {!!notificationCount && <NotificationBadge count={notificationCount} />}
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: theme.spacing.small,
    marginTop: theme.spacing.medium,
    marginHorizontal: theme.spacing.medium,
  },
  text: {
    // Wraps a long heading, so the notification badge stays visible
    flexShrink: 1,
  },
}));
