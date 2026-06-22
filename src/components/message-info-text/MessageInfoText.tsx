import React from 'react';
import {ColorValue, StyleProp, View} from 'react-native';
import {
  type MarginStyle,
  Statuses,
  StyleSheet,
  useThemeContext,
} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {statusTypeToIcon} from '@atb/utils/status-type-to-icon';
import {ContrastColor} from '@atb/theme/colors';

export type MessageInfoTextProps = {
  type: Statuses;
  message: string;
  a11yLabel?: string;
  style?: StyleProp<MarginStyle>;
  testID?: string;
  iconPosition?: 'right' | 'left';
  textColor?: ContrastColor | ColorValue;
  isMarkdown?: boolean;
};

export const MessageInfoText = ({
  type,
  style,
  message,
  a11yLabel,
  iconPosition = 'left',
  testID,
  textColor,
  isMarkdown = false,
}: MessageInfoTextProps) => {
  const styles = useStyles();
  const {themeName} = useThemeContext();

  const iconColorProps = {color: textColor};

  return (
    <View
      style={[styles.container, style]}
      accessible={true}
      testID={testID}
      accessibilityLabel={a11yLabel ?? message}
    >
      {iconPosition === 'left' && (
        <ThemeIcon
          svg={statusTypeToIcon(type, true, themeName)}
          {...iconColorProps}
        />
      )}

      <View style={styles.text}>
        <ThemeText
          color={textColor}
          isMarkdown={isMarkdown}
          typography="body__s"
          testID={`${testID}Text`}
        >
          {message}
        </ThemeText>
      </View>

      {iconPosition === 'right' && (
        <ThemeIcon
          svg={statusTypeToIcon(type, true, themeName)}
          {...iconColorProps}
        />
      )}
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flexDirection: 'row',
    gap: theme.spacing.small,
  },
  text: {
    flex: 1,
  },
}));
