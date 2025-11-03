import React from 'react';
import {useThemeContext} from '@atb/theme';
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
  typography?: TextNames;
  type?: keyof ContrastColor['foreground'];
  color?: ContrastColor | Statuses | TextColor | ColorValue;
  isMarkdown?: boolean;
};

export const ThemeText: React.FC<ThemeTextProps> = ({
  typography: fontType = 'body__primary',
  type = 'primary',
  color,
  isMarkdown = false,
  style,
  children,
  ...props
}) => {
  const {theme, androidSystemFont} = useThemeContext();
  const textColor = useColor(color, type);

  const typeStyle = {
    ...theme.typography[fontType],
    color: textColor,
  };

  let textStyle: TextStyle = typeStyle;

  if (Platform.OS === 'android' && !androidSystemFont) {
    textStyle = {
      ...typeStyle,
      fontFamily: fontWeightToRobotoFamily(typeStyle.fontWeight),
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

function useColor(
  color: ContrastColor | TextColor | Statuses | ColorValue | undefined,
  type: keyof ContrastColor['foreground'],
) {
  const {theme} = useThemeContext();
  if (typeof color === 'object') {
    return color.foreground[type];
  } else if (isStatusColor(color, theme)) {
    return theme.color.status[color].secondary.foreground[type];
  } else if (isTextColor(color, theme) || color === undefined) {
    return theme.color.foreground.dynamic[color ?? 'primary'];
  } else {
    return color;
  }
}

function fontWeightToRobotoFamily(weight?: string) {
  switch (weight) {
    case '400':
      return 'Roboto-Regular';
    case '500':
      return 'Roboto-Medium';
    case '600':
    case 'bold':
      return 'Roboto-SemiBold';
    default:
      return 'Roboto-Regular';
  }
}
