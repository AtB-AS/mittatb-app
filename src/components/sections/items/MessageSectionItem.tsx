import React from 'react';
import {Linking, View} from 'react-native';
import {useSectionItem} from '../use-section-item';
import {SectionItemProps} from '../types';
import {ThemeText} from '@atb/components/text';
import {StyleSheet, useTheme} from '@atb/theme';
import {Statuses} from '@atb/theme';
import {ThemeIcon} from '@atb/components/theme-icon';
import {dictionary, useTranslation} from '@atb/translations';
import {messageTypeToIcon} from '@atb/utils/message-type-to-icon';
import {MessageInfoBoxProps} from '@atb/components/message-info-box';
import {PressableOpacityOrView} from '@atb/components/touchable-opacity-or-view';

type Props = SectionItemProps<{
  messageType: Statuses;
  title?: MessageInfoBoxProps['title'];
  message: MessageInfoBoxProps['message'];
  onPressConfig?: MessageInfoBoxProps['onPressConfig'];
  focusRef?: React.Ref<any>;
}>;

export function MessageSectionItem({
  messageType,
  title,
  message,
  onPressConfig,
  focusRef,
  ...props
}: Props) {
  const {topContainer} = useSectionItem(props);
  const styles = useStyles(messageType)();
  const {theme, themeName} = useTheme();
  const a11yLabel = useA11yLabel(
    messageType,
    title,
    message,
    onPressConfig?.text,
  );

  const themeColor = theme.color.status[messageType].secondary;

  const onPress =
    onPressConfig &&
    ('action' in onPressConfig
      ? onPressConfig.action
      : () => Linking.openURL(onPressConfig.url));
  const accessibilityRole =
    onPressConfig && 'action' in onPressConfig ? 'button' : 'link';

  return (
    <PressableOpacityOrView
      onClick={onPress}
      accessible={true}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={a11yLabel}
      style={[topContainer, styles.container]}
      focusRef={focusRef}
    >
      <ThemeIcon
        style={styles.icon}
        color={themeColor.foreground.primary}
        svg={messageTypeToIcon(messageType, true, themeName)}
      />
      <View style={styles.textContent}>
        {title && (
          <ThemeText
            typography="body__primary--bold"
            style={styles.title}
            color={messageType}
            testID="title"
          >
            {title}
          </ThemeText>
        )}
        <ThemeText color={messageType}>{message}</ThemeText>
        {onPressConfig?.text && (
          <ThemeText
            color={messageType}
            style={styles.linkText}
            typography="body__primary--underline"
          >
            {onPressConfig.text}
          </ThemeText>
        )}
      </View>
    </PressableOpacityOrView>
  );
}

const useA11yLabel = (
  messageType: Statuses,
  title: string | undefined,
  message: string,
  onPressText: string | undefined,
) => {
  const {t} = useTranslation();
  return `
    ${t(dictionary.messageTypes[messageType])}
    ${title ? title : ''}
    ${message}
    ${onPressText ? onPressText : ''}
  `;
};

const useStyles = (type: Statuses) =>
  StyleSheet.createThemeHook((theme) => ({
    container: {
      backgroundColor: theme.color.status[type].secondary.background,
      flexDirection: 'row',
      borderWidth: theme.border.width.medium,
      borderColor: theme.color.status[type].primary.background,
    },
    icon: {marginRight: theme.spacing.small},
    textContent: {flex: 1},
    title: {marginBottom: theme.spacing.small},
    linkText: {marginTop: theme.spacing.medium},
  }));
