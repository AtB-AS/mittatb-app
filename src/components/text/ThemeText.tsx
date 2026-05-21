import React from 'react';
import {resolveColorValue, useThemeContext} from '@atb/theme';
import {
  ColorValue,
  Platform,
  Text,
  TextProps,
  TextStyle,
  View,
} from 'react-native';
import {renderMarkdown} from './markdown-renderer';
import {getTextWeightStyle, MAX_FONT_SCALE} from './utils';
import {ContrastColor, ForegroundType, TextNames} from '@atb/theme/colors';
import {useFontScale} from '@atb/utils/use-font-scale';

export type ThemeTextProps = TextProps & {
  typography?: TextNames;
  type?: ForegroundType;
  /**
   * Pass a ContrastColor from the theme for semantic color resolution.
   * The foreground tier is selected via the `type` prop.
   * Use a resolved hex string only for explicit color overrides.
   * Do NOT pass TextColor strings like 'primary' or 'secondary' —
   * use the `type` prop instead.
   */
  color?: ContrastColor | ColorValue;
  isMarkdown?: boolean;
};

export const ThemeText: React.FC<ThemeTextProps> = ({
  typography: fontType = 'body__m',
  type = 'primary',
  color,
  isMarkdown = false,
  style,
  children,
  ...props
}) => {
  const {theme, androidSystemFont} = useThemeContext();
  const textColor = resolveColorValue(color, type, theme);
  const fontScale = useFontScale();

  const typeStyle = {
    ...theme.typography[fontType],
    color: textColor,
  };

  let textStyle: TextStyle = {
    ...typeStyle,
    ...getTextWeightStyle(androidSystemFont, typeStyle.fontWeight),
  };

  // Set specific letter spacing for android phones, as 0.4 leads to errors on newer pixel phones
  // https://github.com/facebook/react-native/issues/35039
  if (
    Platform.OS === 'android' &&
    textStyle.letterSpacing !== undefined &&
    fontScale < 1.0
  ) {
    textStyle = {
      ...textStyle,
      letterSpacing: textStyle.letterSpacing - 0.05,
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
          androidSystemFont,
        })
      : children;

  // If markdown is enabled, we need to wrap the content in a <View></View> to properly align the <Text></Text> elements,
  // by doing this we also avoid to wrap the list elements inside the markdown render in a Text component, which is not allowed.
  if (isMarkdown) {
    return <View>{content}</View>;
  }

  return <Text {...textProps}>{content}</Text>;
};
