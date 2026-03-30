import React from 'react';
import {View} from 'react-native';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {ThemeIcon} from '@atb/components/theme-icon';
import {SvgProps} from 'react-native-svg';

type NotificationChildProps = {
  /**
   * Extra padding to add to the right side of the content area to accommodate
   * the notification badge without overlap. Should be added to the child's
   * existing right padding. Is 0 when no notification is present.
   */
  extraPaddingRight: number;
};

type WithNotificationBadgeProps = {
  notification?: (props: SvgProps) => React.JSX.Element;
  children: (props: NotificationChildProps) => React.ReactNode;
};

/**
 * Wraps children with a notification badge on the right edge.
 * Children receive an `extraPaddingRight` value that must be added to their
 * existing right padding to accommodate the badge without overlap.
 */
export const WithNotificationBadge: React.FC<WithNotificationBadgeProps> = ({
  children,
  notification,
}) => {
  const styles = useStyles();
  const {theme} = useThemeContext();

  /**
   * Extra padding to add to the right side of an icon box content area
   * to accommodate the notification badge without overlap.
   */
  const extraPaddingRight = theme.icon.size.small / 2;

  if (!notification) {
    return <>{children({extraPaddingRight: 0})}</>;
  }

  return (
    <View style={styles.wrapper}>
      {children({extraPaddingRight})}
      <View style={styles.badge}>
        <View style={styles.badgeBackground}>
          <ThemeIcon svg={notification} size="small" style={{}} />
        </View>
      </View>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  const notificationBorderWidth = theme.border.width.medium;
  const notificationTotalSize =
    theme.icon.size.small + notificationBorderWidth * 2;

  return {
    wrapper: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    badge: {
      /**
       * Centers the notification badge on the right edge of the icon box
       */
      marginLeft: -notificationBorderWidth - theme.icon.size.small / 2,
      /**
       * Maintains visual balance by making the distance from the colored edge
       * of the notification icon to the next element the same as it would be
       * from an icon box without a notification icon.
       */
      marginRight: -notificationBorderWidth,
    },
    badgeBackground: {
      backgroundColor: theme.color.background.neutral[0].background,
      borderRadius: notificationTotalSize / 2,
      padding: notificationBorderWidth,
    },
  };
});
