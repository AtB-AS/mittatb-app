import React from 'react';
import {View} from 'react-native';
import {SectionItem, useSectionItem} from './section-utils';
import ThemeText from '@atb/components/text';
import {StyleSheet, useTheme} from '@atb/theme';
import {Statuses} from '@atb-as/theme';
import ThemeIcon from '@atb/components/theme-icon';
import {dictionary, useTranslation} from '@atb/translations';
import {messageTypeToIcon} from '@atb/utils/message-type-to-icon';

export type MessageItemProps = SectionItem<{
  messageType: Statuses;
  title?: string;
  message: string;
}>;

export default function MessageItem({
  messageType,
  title,
  message,
  ...props
}: MessageItemProps) {
  const {topContainer} = useSectionItem(props);
  const styles = useStyles();
  const {theme} = useTheme();
  const a11yLabel = useA11yLabel(messageType, title, message);

  const themeColor = theme.static.status[messageType];

  return (
    <View
      accessible={true}
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
      <View>
        {title && (
          <ThemeText
            type="body__primary--bold"
            style={styles.title}
            color={messageType}
          >
            {title}
          </ThemeText>
        )}
        <ThemeText style={styles.message} color={messageType}>
          {message}
        </ThemeText>
      </View>
    </View>
  );
}

const useA11yLabel = (
  messageType: Statuses,
  title: string | undefined,
  message: string,
) => {
  const {t} = useTranslation();
  return `
    ${t(dictionary.messageTypes[messageType])}
    ${title ? title : ''}
    ${message}
  `;
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {flexDirection: 'row'},
  icon: {marginRight: theme.spacings.medium},
  title: {marginBottom: theme.spacings.small},
  message: {flex: 1},
}));
