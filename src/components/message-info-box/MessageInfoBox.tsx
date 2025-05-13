import React from 'react';
import {Linking, StyleProp, View, ViewStyle} from 'react-native';
import {Statuses, StyleSheet, useThemeContext} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import MessageBoxTexts from '@atb/translations/components/MessageBox';
import {dictionary, useTranslation} from '@atb/translations';
import {Close} from '@atb/assets/svg/mono-icons/actions';
import {messageTypeToIcon} from '@atb/utils/message-type-to-icon';
import {PressableOpacityOrView} from '@atb/components/touchable-opacity-or-view';
import {insets} from '@atb/utils/insets';
import {screenReaderPause} from '@atb/components/text';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {
  type A11yLiveRegion,
  useLiveRegionAnnouncement,
} from '@atb/components/screen-reader-announcement';
import {isDefined} from '@atb/utils/presence';

/**
 * Configuration for how the onPress on the message box should work. The
 * configuration is split into action (function) or url (string) so that we can
 * decide correct accessibility role on the message box.
 *
 * Note that for the screen reader the value in the `text` field will be
 * prefixed with "Activate to". So good labels are for example "Try again",
 * "Read more at atb.no" and "Show details" as they all work well with the
 * prefix.
 */
export type OnPressConfig = {
  text: string;
} & ({action: () => void} | {url: string});

export type MessageInfoBoxProps = {
  type: Statuses;
  title?: string;
  message?: string;
  noStatusIcon?: boolean;
  onDismiss?: () => void;
  isMarkdown?: boolean;
  style?: StyleProp<ViewStyle>;
  onPressConfig?: OnPressConfig;
  a11yLiveRegion?: A11yLiveRegion;
  focusRef?: React.Ref<any>;
  testID?: string;
};
export const MessageInfoBox = ({
  noStatusIcon,
  type,
  style,
  message,
  title,
  isMarkdown = false,
  onPressConfig,
  onDismiss,
  a11yLiveRegion,
  focusRef,
  testID,
}: MessageInfoBoxProps) => {
  const {theme, themeName} = useThemeContext();
  const styles = useStyles(type)();
  const {t} = useTranslation();
  const iconColorProps = {
    color: theme.color.status[type].secondary.foreground.primary,
  };
  const textColor = theme.color.status[type].secondary.foreground.primary;

  const onPress =
    onPressConfig &&
    ('action' in onPressConfig
      ? onPressConfig.action
      : () => Linking.openURL(onPressConfig.url));

  const a11yCriticalityPrefix = t(dictionary.messageTypes[type]);
  const a11yLabel = [a11yCriticalityPrefix, title, message, onPressConfig?.text]
    .filter(isDefined)
    .join(screenReaderPause);
  const liveRegionA11yProps = useLiveRegionAnnouncement(
    a11yLabel,
    a11yLiveRegion,
  );

  return (
    <PressableOpacityOrView
      onClick={onPress}
      style={[styles.container, style]}
      accessible={false}
      testID={testID}
      focusRef={focusRef}
    >
      {!noStatusIcon && (
        <ThemeIcon
          style={styles.icon}
          svg={messageTypeToIcon(type, true, themeName)}
          {...iconColorProps}
        />
      )}
      <View
        style={styles.content}
        accessibilityRole={
          onPressConfig && ('action' in onPressConfig ? 'button' : 'link')
        }
        accessibilityHint={
          onPressConfig &&
          ('action' in onPressConfig
            ? t(MessageBoxTexts.a11yHintActionPrefix)
            : t(MessageBoxTexts.a11yHintUrlPrefix)) + onPressConfig.text
        }
        {...liveRegionA11yProps}
      >
        {title && (
          <ThemeText
            typography="body__primary--bold"
            color={textColor}
            style={styles.title}
            testID={testID ? `${testID}Title` : 'title'}
          >
            {title}
          </ThemeText>
        )}
        {message && (
          <ThemeText
            color={textColor}
            typography="body__primary"
            isMarkdown={isMarkdown}
          >
            {message}
          </ThemeText>
        )}
        {onPressConfig?.text && (
          <ThemeText
            color={textColor}
            style={styles.linkText}
            typography="body__primary--underline"
          >
            {onPressConfig.text}
          </ThemeText>
        )}
      </View>
      {onDismiss && (
        <View>
          <PressableOpacity
            onPress={onDismiss}
            accessible={true}
            accessibilityLabel={t(MessageBoxTexts.dismiss.allyLabel)}
            accessibilityRole="button"
            hitSlop={insets.all(theme.spacing.medium)}
            testID={testID ? `${testID}Close` : 'close'}
          >
            <ThemeIcon svg={Close} {...iconColorProps} />
          </PressableOpacity>
        </View>
      )}
    </PressableOpacityOrView>
  );
};

const useStyles = (type: Statuses) =>
  StyleSheet.createThemeHook((theme) => ({
    container: {
      backgroundColor: theme.color.status[type].secondary.background,
      borderColor: theme.color.status[type].primary.background,
      borderRadius: theme.border.radius.regular,
      borderWidth: theme.border.width.medium,
      flexDirection: 'row',
      padding: theme.spacing.medium,
    },
    content: {
      flex: 1,
    },
    icon: {
      marginRight: theme.spacing.small,
    },
    linkText: {
      marginTop: theme.spacing.medium,
    },
    title: {
      marginBottom: theme.spacing.small,
    },
  }));
