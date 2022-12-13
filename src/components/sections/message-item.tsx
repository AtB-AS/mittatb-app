import React from 'react';
import {Linking, View} from 'react-native';
import {SectionItem, useSectionItem} from './section-utils';
import ThemeText from '@atb/components/text';
import {StyleSheet, useTheme} from '@atb/theme';
import {Statuses} from '@atb-as/theme';
import ThemeIcon from '@atb/components/theme-icon';
import {dictionary, useTranslation} from '@atb/translations';
import {messageTypeToIcon} from '@atb/utils/message-type-to-icon';
import {MessageBoxProps} from '@atb/components/message-box';
import {TouchableOpacityOrView} from '@atb/components/touchable-opacity-or-view';

export type MessageItemProps = SectionItem<{
  messageType: Statuses;
  title?: MessageBoxProps['title'];
  message: MessageBoxProps['message'];
  onPressConfig?: MessageBoxProps['onPressConfig'];
}>;

export default function MessageItem({
  messageType,
  title,
  message,
  onPressConfig,
  ...props
}: MessageItemProps) {
  const {topContainer} = useSectionItem(props);
  const styles = useStyles();
  const {theme} = useTheme();
  const a11yLabel = useA11yLabel(
    messageType,
    title,
    message,
    onPressConfig?.text,
  );

  const themeColor = theme.static.status[messageType];

  const onPress =
    onPressConfig &&
    ('action' in onPressConfig
      ? onPressConfig.action
      : () => Linking.openURL(onPressConfig.url));

  return (
    <TouchableOpacityOrView
      onClick={onPress}
      accessible={true}
      accessibilityRole={onPress && 'button'}
      accessibilityLabel={a11yLabel}
      style={[
        topContainer,
        {backgroundColor: themeColor.background},
        styles.container,
      ]}
    >
      <ThemeIcon
        style={styles.icon}
        fill={themeColor.text}
        svg={messageTypeToIcon(messageType)}
      />
      <View style={styles.textContent}>
        {title && (
          <ThemeText
            type="body__primary--bold"
            style={styles.title}
            color={messageType}
          >
            {title}
          </ThemeText>
        )}
        <ThemeText color={messageType}>{message}</ThemeText>
        {onPressConfig?.text && (
          <ThemeText
            color={messageType}
            style={styles.linkText}
            type="body__primary--underline"
          >
            {onPressConfig.text}
          </ThemeText>
        )}
      </View>
    </TouchableOpacityOrView>
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

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {flexDirection: 'row'},
  icon: {marginRight: theme.spacings.medium},
  textContent: {flex: 1},
  title: {marginBottom: theme.spacings.small},
  linkText: {marginTop: theme.spacings.medium},
}));
