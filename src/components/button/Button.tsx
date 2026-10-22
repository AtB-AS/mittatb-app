import {ThemeText} from '@atb/components/text';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {Theme} from '@atb/theme/colors';
import React from 'react';
import {
  type ColorValue,
  StyleProp,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {ThemeIcon} from '@atb/components/theme-icon';
import {
  NativeTouchable,
  NativeTouchableProps,
} from '@atb/components/native-touchable';
import {shadows} from '@atb/modules/map';
import {ContrastColor, SurfaceColorName} from '@atb/theme/colors';
import {Loading} from '../loading';

type ButtonMode = 'primary' | 'secondary' | 'tertiary';
type ButtonType = 'large' | 'small';

type ButtonIconProps = {
  svg: ({fill}: {fill: string}) => React.JSX.Element;
  notificationColor?: ContrastColor;
};

export type ButtonProps = {
  onPress(): void;
  mode?: ButtonMode;
  text?: string;
  type?: ButtonType;
  leftIcon?: ButtonIconProps;
  rightIcon?: ButtonIconProps;
  surfaceColor: SurfaceColorName;
  expanded: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  hasShadow?: boolean;
} & Omit<NativeTouchableProps, 'variant'>;

export const Button = React.forwardRef<any, ButtonProps>((props, ref) => {
  const {
    onPress,
    mode = 'primary',
    type = 'large',
    leftIcon,
    rightIcon,
    text,
    surfaceColor,
    disabled,
    loading = false,
    expanded,
    hasShadow = false,
    style,
    ...otherProps
  } = props;

  const styles = useButtonStyle();
  const {theme} = useThemeContext();

  const {mainContrastColor, borderColorValue, pressedColorValue} =
    getButtonColors(props, surfaceColor, theme);

  const spacing = theme.spacing.medium;
  // Subtract the border width so the large button matches the design height,
  // where the border is drawn inside the button.
  const largePadding = spacing - theme.border.width.slim;

  const styleContainer: ViewStyle[] = [
    styles.button,
    {
      backgroundColor: mainContrastColor.background,
      borderColor: borderColorValue,
      paddingHorizontal: type === 'small' ? spacing : largePadding,
      gap: type === 'small' ? theme.spacing.xSmall : undefined,
      paddingVertical: type === 'small' ? theme.spacing.xSmall : largePadding,
      borderRadius: theme.border.radius.circle,
      borderWidth: theme.border.width.slim,
      ...(expanded && type === 'small'
        ? {
            justifyContent: 'center',
          }
        : {
            alignSelf: 'flex-start',
          }),
    },
  ];

  const textMarginHorizontal = useTextMarginHorizontal(
    expanded,
    leftIcon,
    rightIcon,
  );

  const iconStyle = (iconSide: 'left' | 'right'): ViewStyle => {
    const iconMargin = iconSide === 'left' ? 'marginRight' : 'marginLeft';
    if (expanded && text && type !== 'small') {
      return {
        position: 'absolute',
        [iconSide]: largePadding,
        [iconMargin]: text ? theme.spacing.xSmall : undefined,
      };
    }

    return {
      [iconMargin]: text
        ? type === 'small'
          ? theme.spacing.xSmall
          : spacing
        : undefined,
    };
  };

  const styleText: TextStyle = {
    // Add 1% width to the text to avoid layout issues on Android with small font sizes
    width: !expanded ? '101%' : undefined,
  };
  const textContainer: TextStyle = {
    flex: !expanded ? undefined : 1,
    alignItems: 'center',
    marginHorizontal: textMarginHorizontal,
    flexShrink: !expanded ? 1 : undefined,
    ...(expanded &&
      type === 'small' && {
        flex: undefined,
        marginHorizontal: theme.spacing.xSmall,
      }),
  };

  const leftStyling: ViewStyle = iconStyle('left');
  const rightStyling: ViewStyle = iconStyle('right');

  if (!text && !(leftIcon || rightIcon)) {
    return null;
  }

  return (
    <NativeTouchable
      variant="block"
      accessible
      accessibilityRole="button"
      accessibilityState={{disabled}}
      style={[styleContainer, hasShadow ? shadows : undefined, style]}
      onPress={disabled || loading ? undefined : onPress}
      disabled={disabled || loading}
      pressedColor={pressedColorValue}
      ref={ref}
      {...otherProps}
    >
      {leftIcon && (
        <View style={leftStyling}>
          <ButtonIcon {...leftIcon} mainContrastColor={mainContrastColor} />
        </View>
      )}
      {text && (
        <View style={textContainer}>
          <ThemeText
            typography={getTextType(mode, type)}
            style={styleText}
            color={mainContrastColor}
            testID="buttonText"
          >
            {text}
          </ThemeText>
        </View>
      )}
      {(rightIcon || loading) && (
        <View style={rightStyling}>
          {loading ? (
            <Loading
              size="small"
              donutColor={mainContrastColor.background}
              arcColor={mainContrastColor.foreground.primary}
            />
          ) : (
            rightIcon && (
              <ButtonIcon
                {...rightIcon}
                mainContrastColor={mainContrastColor}
              />
            )
          )}
        </View>
      )}
    </NativeTouchable>
  );
});

const ButtonIcon = ({
  svg,
  notificationColor,
  mainContrastColor,
}: ButtonIconProps & {
  mainContrastColor: ContrastColor;
}) => (
  <ThemeIcon
    svg={svg}
    color={mainContrastColor}
    size="normal"
    notification={
      notificationColor && {
        color: notificationColor,
        backgroundColor: mainContrastColor,
      }
    }
  />
);

/**
 * Get the button colors based on the button mode and the selected surface
 * color. The returned mainContrastColor is the ContrastColor for the background
 * and text of the button. Secondary and tertiary buttons are transparent. In
 * addition, a borderColorValue is returned for the border color, and a
 * pressedColorValue for the background color shown while the button is
 * pressed.
 */
const getButtonColors = (
  props: ButtonProps,
  surfaceColor: SurfaceColorName,
  theme: Theme,
): {
  mainContrastColor: ContrastColor;
  borderColorValue: ColorValue;
  pressedColorValue: ColorValue;
} => {
  const surface = theme.color.surface[surfaceColor];

  const transparentContrastColor: ContrastColor = {
    background: 'transparent',
    foreground: theme.color.foreground.dynamic,
  };

  switch (props.mode) {
    case 'primary':
    case undefined:
      return {
        mainContrastColor: surface.strong,
        borderColorValue: surface.strong.background,
        pressedColorValue: surface.strongPressed.background,
      };
    case 'secondary':
      return {
        mainContrastColor: transparentContrastColor,
        borderColorValue: surface.strong.background,
        pressedColorValue: surface.subtlePressed.background,
      };
    case 'tertiary':
      return {
        mainContrastColor: transparentContrastColor,
        borderColorValue: transparentContrastColor.background,
        pressedColorValue: surface.subtlePressed.background,
      };
  }
};

/**
 * Get the extra horizontal margin for the button text. This is for normal
 * "block" type (not inline) buttons as the icons are placed with absolute
 * position, to not offset the centering of the text. This method calculates the
 * necessary horizontal margin based on the largest icon size.
 */
const useTextMarginHorizontal = (
  expand: boolean,
  leftIcon?: ButtonIconProps,
  rightIcon?: ButtonIconProps,
) => {
  const {theme} = useThemeContext();
  if (!expand) return 0;
  if (!leftIcon && !rightIcon) return 0;
  return theme.icon.size['normal'] + theme.spacing.xSmall;
};

const useButtonStyle = StyleSheet.createThemeHook(() => ({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}));

function getTextType(mode: string, type: string) {
  if (type === 'small')
    switch (mode) {
      case 'primary':
      case 'secondary':
        return 'body__s__strong';
      case 'tertiary':
        return 'body__s';
    }

  switch (mode) {
    case 'primary':
    case 'secondary':
      return 'body__m__strong';
    case 'tertiary':
      return 'body__m';
  }
}
