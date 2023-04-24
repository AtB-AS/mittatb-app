import React from 'react';
import {StyleProp, TouchableOpacity, View, ViewStyle} from 'react-native';
import {Statuses, StyleSheet, useTheme} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import MessageBoxTexts from '@atb/translations/components/MessageBox';
import {useTranslation} from '@atb/translations';
import {Close} from '@atb/assets/svg/mono-icons/actions';
import {messageTypeToIcon} from '@atb/utils/message-type-to-icon';
import {TouchableOpacityOrView} from '@atb/components/touchable-opacity-or-view';
import {insets} from '@atb/utils/insets';
import {SvgProps} from 'react-native-svg';
import {Button} from '@atb/components/button';
import {ExternalLink} from '@atb/assets/svg/mono-icons/navigation';

type ActionStyle = 'text' | 'button';

/**
 * Note that for the screen reader the value in the `text` field will be
 * prefixed with "Activate to". So good labels are for example "Try again",
 * "Read more at atb.no" and "Show details" as they all work well with the
 * prefix.
 */
export type MessageBoxAction = {
  text: string;
  type: ActionStyle;
  onPress: () => void;
};

export type MessageBoxV2Props = {
  type: Statuses;
  title?: string;
  message: string;
  // When enabled, the Icon from `type: Statuses` is disabled.
  icon?: (props: SvgProps) => JSX.Element;
  noStatusIcon?: boolean;
  onDismiss?: () => void;
  isMarkdown?: boolean;
  style?: StyleProp<ViewStyle>;
  actions?: MessageBoxAction[];
};

export const MessageBoxV2 = ({
  noStatusIcon,
  type,
  style,
  message,
  title,
  isMarkdown = false,
  actions,
  icon,
  onDismiss,
}: MessageBoxV2Props) => {
  const {theme} = useTheme();
  const styles = useStyles();
  const {t} = useTranslation();
  const textColor = theme.static.status[type].text;
  const colorStyle = {
    backgroundColor: theme.static.status[type].background,
  };

  return (
    <View style={[styles.container, colorStyle, style]} accessible={false}>
      {icon ? (
        <View style={styles.customIcon}>
          <ThemeIcon svg={icon} />
        </View>
      ) : (
        !noStatusIcon && (
          <ThemeIcon
            fill={textColor}
            style={styles.icon}
            svg={messageTypeToIcon(type)}
          />
        )
      )}
      <View style={styles.content}>
        {title && (
          <ThemeText
            type="body__primary--bold"
            color={type}
            style={styles.title}
          >
            {title}
          </ThemeText>
        )}
        <ThemeText color={type} isMarkdown={isMarkdown}>
          {message}
        </ThemeText>
        {actions && (
          <View style={styles.actions}>
            {actions.map((action) => {
              switch (action.type) {
                case 'text':
                  return (
                    <TouchableOpacityOrView
                      onClick={action.onPress}
                      style={colorStyle}
                      accessible={true}
                      accessibilityRole="link"
                      accessibilityHint={
                        t(MessageBoxTexts.a11yHintPrefix) + action.text
                      }
                    >
                      <ThemeText
                        color={type}
                        style={styles.action}
                        type="body__primary--underline"
                      >
                        {action.text}
                      </ThemeText>
                    </TouchableOpacityOrView>
                  );
                case 'button':
                  return (
                    <Button
                      type="pill"
                      interactiveColor="interactive_3"
                      text={action.text}
                      onPress={action.onPress}
                      style={styles.action}
                      rightIcon={{svg: ExternalLink}}
                    />
                  );
              }
            })}
          </View>
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
            <ThemeIcon fill={textColor} svg={Close} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    padding: theme.spacings.medium,
    borderRadius: theme.border.radius.regular,
    flexDirection: 'row',
  },
  icon: {
    marginRight: theme.spacings.medium,
  },
  customIcon: {
    marginRight: theme.spacings.medium,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  actions: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  action: {
    marginTop: theme.spacings.medium,
    marginRight: theme.spacings.medium,
  },
  title: {
    marginBottom: theme.spacings.small,
  },
}));
