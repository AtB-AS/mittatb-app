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
  hideText?: boolean;
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
  isInlineOnPressText?: boolean;
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
  const styles = useStyles();
  const {t} = useTranslation();
  const iconColorProps = {fill: theme.static.status[type].text};
  const backgroundColorStyle = {
    backgroundColor: theme.static.status[type].background,
  };

  const onPress =
    onPressConfig &&
    ('action' in onPressConfig
      ? onPressConfig.action
      : () => Linking.openURL(onPressConfig.url));

  const a11yLabel = [
    title,
    message,
    onPressConfig?.hideText ? '' : onPressConfig?.text,
  ]
    .filter((s): s is string => !!s)
    .join(screenReaderPause);

  return (
    <PressableOpacityOrView
      onClick={onPress}
      style={[
        styles.container,
        styles.withBackground,
        backgroundColorStyle,
        style,
      ]}
      accessible={false}
      testID={testID}
    >
      {!noStatusIcon && (
        <ThemeIcon
          style={styles.icon}
          svg={messageTypeToIcon(type, false)}
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
          t(MessageBoxTexts.a11yHintPrefix) + onPressConfig.text
        }
      >
        {title && (
          <ThemeText
            type="body__primary--bold"
            color={type}
            style={styles.title}
            testID={testID ? `${testID}Title` : 'title'}
          >
            {title}
          </ThemeText>
        )}
        <ThemeText color={type} type="body__primary" isMarkdown={isMarkdown}>
          {message}
        </ThemeText>
        {!onPressConfig?.hideText && onPressConfig?.text && (
          <ThemeText
            color={type}
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

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flexDirection: 'row',
  },
  withBackground: {
    padding: theme.spacings.medium,
    borderRadius: theme.border.radius.regular,
  },
  icon: {
    marginRight: theme.spacings.medium,
  },
  content: {
    flex: 1,
  },
  linkText: {
    marginTop: theme.spacings.medium,
  },
  title: {
    marginBottom: theme.spacings.small,
  },
}));
