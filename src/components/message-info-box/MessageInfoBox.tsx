import React from 'react';
import {Linking, StyleProp, View, ViewStyle} from 'react-native';
import {Statuses, StyleSheet, useTheme} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import MessageBoxTexts from '@atb/translations/components/MessageBox';
import {useTranslation} from '@atb/translations';
import {Close} from '@atb/assets/svg/mono-icons/actions';
import {messageTypeToIcon} from '@atb/utils/message-type-to-icon';
import {PressableOpacityOrView} from '@atb/components/touchable-opacity-or-view';
import {insets} from '@atb/utils/insets';
import {screenReaderPause} from '@atb/components/text';
import {PressableOpacity} from '@atb/components/pressable-opacity';

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
  message: string;
  noStatusIcon?: boolean;
  onDismiss?: () => void;
  isMarkdown?: boolean;
  style?: StyleProp<ViewStyle>;
  onPressConfig?: OnPressConfig;
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
  testID,
}: MessageInfoBoxProps) => {
  const {theme} = useTheme();
  const styles = useStyles(type)();
  const {t} = useTranslation();
  const iconColorProps = {fill: theme.status[type].secondary.text};
  const textColor = theme.status[type].secondary;

  const onPress =
    onPressConfig &&
    ('action' in onPressConfig
      ? onPressConfig.action
      : () => Linking.openURL(onPressConfig.url));

  const a11yLabel = [title, message, onPressConfig?.text]
    .filter((s): s is string => !!s)
    .join(screenReaderPause);

  return (
    <PressableOpacityOrView
      onClick={onPress}
      style={[styles.container, style]}
      accessible={false}
      testID={testID}
    >
      {!noStatusIcon && (
        <ThemeIcon
          style={styles.icon}
          svg={messageTypeToIcon(type, true)}
          {...iconColorProps}
        />
      )}
      <View
        style={styles.content}
        accessible={true}
        accessibilityRole={
          onPressConfig && ('action' in onPressConfig ? 'button' : 'link')
        }
        accessibilityLabel={a11yLabel}
        accessibilityHint={
          onPressConfig &&
          ('action' in onPressConfig
            ? t(MessageBoxTexts.a11yHintActionPrefix)
            : t(MessageBoxTexts.a11yHintUrlPrefix)) + onPressConfig.text
        }
      >
        {title && (
          <ThemeText
            type="body__primary--bold"
            color={textColor}
            style={styles.title}
            testID={testID ? `${testID}Title` : 'title'}
          >
            {title}
          </ThemeText>
        )}
        <ThemeText
          color={textColor}
          type="body__primary"
          isMarkdown={isMarkdown}
        >
          {message}
        </ThemeText>
        {onPressConfig?.text && (
          <ThemeText
            color={textColor}
            style={styles.linkText}
            type="body__primary--underline"
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
            hitSlop={insets.all(theme.spacings.medium)}
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
      backgroundColor: theme.status[type].secondary.background,
      borderColor: theme.status[type].primary.background,
      borderRadius: theme.border.radius.regular,
      borderWidth: theme.border.width.medium,
      flexDirection: 'row',
      padding: theme.spacings.medium,
    },
    content: {
      flex: 1,
    },
    icon: {
      marginRight: theme.spacings.medium,
    },
    linkText: {
      marginTop: theme.spacings.medium,
    },
    title: {
      marginBottom: theme.spacings.small,
    },
  }));
