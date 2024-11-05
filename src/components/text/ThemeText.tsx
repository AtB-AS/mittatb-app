import React from 'react';
import {useTheme} from '@atb/theme';
import {
  ColorValue,
  Platform,
  Text,
  TextProps,
  TextStyle,
  View,
} from 'react-native';
import {renderMarkdown} from './markdown-renderer';
import {MAX_FONT_SCALE} from './utils';
import {
  ContrastColor,
  Statuses,
  TextColor,
  TextNames,
  isStatusColor,
  isTextColor,
} from '@atb/theme/colors';

export type ThemeTextProps = TextProps & {
  type?: TextNames;
  color?: ContrastColor | Statuses | TextColor | ColorValue;
  isMarkdown?: boolean;
};

export const ThemeText: React.FC<ThemeTextProps> = ({
  type: fontType = 'body__primary',
  color,
  isMarkdown = false,
  style,
  children,
  ...props
}) => {
  const {theme, useAndroidSystemFont} = useTheme();
  const textColor = useColor(color);

  const typeStyle = {
    ...theme.typography[fontType],
    color: textColor,
  };

  let textStyle: TextStyle = typeStyle;

  if (Platform.OS === 'android' && !useAndroidSystemFont) {
    textStyle = {
      ...typeStyle,
      fontFamily:
        typeStyle.fontWeight === 'bold' ? 'Roboto-Bold' : 'Roboto-Regular',
      fontWeight: 'normal',
    };
  }
  // Set specific letter spacing for android phones, as 0.4 leads to errors on newer pixel phones
  // https://github.com/facebook/react-native/issues/35039
  if (
    Platform.OS === 'android' &&
    (textStyle.letterSpacing === 0.4 || textStyle.letterSpacing === 1.6)
  ) {
    textStyle = {
      ...textStyle,
      letterSpacing: textStyle.letterSpacing - 0.01,
    };
  }

  const textProps = {
    style: [textStyle, style],
    maxFontSizeMultiplier: MAX_FONT_SCALE,
    ...props,
  };

  const content =
    isMarkdown && typeof children === 'string'
      ? renderMarkdown(children, {
          textProps,
          spacingBetweenListElements: theme.spacing.xSmall,
        })
      : children;

  // If markdown is enabled, we need to wrap the content in a <View></View> to properly align the <Text></Text> elements,
  // by doing this we also avoid to wrap the list elements inside the markdown render in a Text component, which is not allowed.
  if (isMarkdown) {
    return <View>{content}</View>;
  }

  return <Text {...textProps}>{content}</Text>;
};

function useColor(color?: ContrastColor | TextColor | Statuses | ColorValue) {
  const {theme} = useTheme();
  if (typeof color === 'object') {
    return color.foreground.primary;
  } else if (isStatusColor(color, theme)) {
    return theme.color.status[color].secondary.foreground.primary;
  } else if (isTextColor(color, theme) || color === undefined) {
    return theme.color.foreground.dynamic[color ?? 'primary'];
  } else {
    return color;
  }
}
