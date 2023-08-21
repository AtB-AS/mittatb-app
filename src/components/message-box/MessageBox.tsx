import React from 'react';
import {
  Linking,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {Statuses, StyleSheet, useTheme} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import MessageBoxTexts from '@atb/translations/components/MessageBox';
import {useTranslation} from '@atb/translations';
import {Close} from '@atb/assets/svg/mono-icons/actions';
import {messageTypeToIcon} from '@atb/utils/message-type-to-icon';
import {TouchableOpacityOrView} from '@atb/components/touchable-opacity-or-view';
import {insets} from '@atb/utils/insets';
import {screenReaderPause} from '@atb/components/text';
import {StaticColor} from '@atb/theme/colors';

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
type OnPressConfig = {
  text: string;
} & ({action: () => void} | {url: string});

export type MessageBoxProps = {
  type: Statuses;
  title?: string;
  message: string;
  noStatusIcon?: boolean;
  onDismiss?: () => void;
  isMarkdown?: boolean;
  style?: StyleProp<ViewStyle>;
  onPressConfig?: OnPressConfig;
  subtle?: boolean;
  /** Text color to use when `subtle` is true. */
  textColor?: StaticColor;
};

export const MessageBox = ({
  noStatusIcon,
  type,
  style,
  message,
  title,
  isMarkdown = false,
  onPressConfig,
  onDismiss,
  subtle,
  textColor,
}: MessageBoxProps) => {
  const {theme} = useTheme();
  const styles = useStyles();
  const {t} = useTranslation();

  const iconColorProps = subtle
    ? {colorType: textColor}
    : {fill: theme.static.status[type].text};
  const backgroundColorStyle = {
    backgroundColor: theme.static.status[type].background,
  };

  const onPress =
    onPressConfig &&
    ('action' in onPressConfig
      ? onPressConfig.action
      : () => Linking.openURL(onPressConfig.url));

  const a11yLabel = [title, message, onPressConfig?.text]
    .filter((s): s is string => !!s)
    .join(screenReaderPause);

  return (
    <TouchableOpacityOrView
      onClick={onPress}
      style={[
        styles.container,
        !subtle && styles.withBackground,
        !subtle && backgroundColorStyle,
        style,
      ]}
      accessible={false}
    >
      {!noStatusIcon && (
        <ThemeIcon
          style={styles.icon}
          svg={messageTypeToIcon(type, subtle)}
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
            type={subtle ? 'body__secondary--bold' : 'body__primary--bold'}
            color={subtle ? textColor : type}
            style={styles.title}
          >
            {title}
          </ThemeText>
        )}
        <ThemeText
          color={subtle ? textColor : type}
          type={subtle ? 'body__secondary' : 'body__primary'}
          isMarkdown={isMarkdown}
        >
          {message}
        </ThemeText>
        {onPressConfig?.text && (
          <ThemeText
            color={subtle ? textColor : type}
            style={styles.linkText}
            type="body__primary--underline"
          >
            {onPressConfig.text}
          </ThemeText>
        )}
      </View>
      {onDismiss && (
        <View>
          <TouchableOpacity
            onPress={onDismiss}
            accessible={true}
            accessibilityLabel={t(MessageBoxTexts.dismiss.allyLabel)}
            accessibilityRole="button"
            hitSlop={insets.all(theme.spacings.medium)}
          >
            <ThemeIcon svg={Close} {...iconColorProps} />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacityOrView>
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
