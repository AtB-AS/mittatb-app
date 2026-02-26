import {ThemeText} from '@atb/components/text';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {Theme} from '@atb/theme/colors';
import React from 'react';
import {
  ActivityIndicator,
  type ColorValue,
  StyleProp,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {ThemeIcon} from '@atb/components/theme-icon';
import {NativeButton, NativeButtonProps} from '@atb/components/native-button';
import {shadows} from '@atb/modules/map';
import {ContrastColor, InteractiveColor} from '@atb/theme/colors';

type ButtonMode = 'primary' | 'secondary' | 'tertiary';
type ButtonType = 'large' | 'small';

type ButtonIconProps = {
  svg: ({fill}: {fill: string}) => React.JSX.Element;
  notificationColor?: ContrastColor;
};

type ButtonModeAwareProps =
  | {mode?: 'primary'}
  | {
      mode: Exclude<ButtonMode, 'primary'>;
      backgroundColor: ContrastColor;
    };

export type ButtonProps = {
  onPress(): void;
  text?: string;
  type?: ButtonType;
  leftIcon?: ButtonIconProps;
  rightIcon?: ButtonIconProps;
  interactiveColor?: InteractiveColor;
  active?: boolean;
  expanded: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  hasShadow?: boolean;
} & ButtonModeAwareProps &
  NativeButtonProps;

export const Button = React.forwardRef<any, ButtonProps>((props, ref) => {
  const {
    onPress,
    mode = 'primary',
    type = 'large',
    leftIcon,
    rightIcon,
    text,
    disabled,
    loading = false,
    expanded,
    hasShadow = false,
    style,
    ...otherProps
  } = props;

  const styles = useButtonStyle();
  const {theme} = useThemeContext();

  const {mainContrastColor, borderColorValue} = getButtonColors(props, theme);

  const spacing = theme.spacing.medium;

  const styleContainer: ViewStyle[] = [
    styles.button,
    {
      backgroundColor: mainContrastColor.background,
      borderColor: borderColorValue,
      paddingHorizontal: spacing,
      gap: type === 'small' ? theme.spacing.xSmall : undefined,
      paddingVertical: type === 'small' ? theme.spacing.xSmall : spacing,
      borderRadius: theme.border.radius.circle,
      borderWidth:
        type === 'small' ? theme.border.width.slim : theme.border.width.medium,
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
        [iconSide]: spacing,
        [iconMargin]: text ? theme.spacing.xSmall : undefined,
      };
    }

    return {
      [iconMargin]: text ? theme.spacing.xSmall : undefined,
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
    <NativeButton
      accessible
      accessibilityRole="button"
      accessibilityState={{disabled}}
      style={[styleContainer, hasShadow ? shadows : undefined, style]}
      onPress={disabled || loading ? undefined : onPress}
      disabled={disabled || loading}
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
            <ActivityIndicator
              size="small"
              color={mainContrastColor.foreground.primary}
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
    </NativeButton>
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
 * Get the button colors based on the input props to the button. The returned
 * mainContrastColor is the ContrastColor for the background and text of the
 * button. In addition, a borderColorValue is returned for the border color. We
 * can't really use a ContrastColor for the border color since sometimes the
 * color is background color and sometimes a foreground color, based on the mode
 * and state of the button.
 */
const getButtonColors = (
  props: ButtonProps,
  theme: Theme,
): {
  mainContrastColor: ContrastColor;
  borderColorValue: ColorValue;
} => {
  const interactiveColor = props.interactiveColor
    ? props.interactiveColor
    : theme.color.interactive[0];

  switch (props.mode) {
    case 'primary':
    case undefined:
      return {
        mainContrastColor: props.active
          ? interactiveColor.active
          : interactiveColor.default,
        borderColorValue: props.active
          ? interactiveColor.outline.background
          : interactiveColor.default.background,
      };
    case 'secondary':
      return {
        mainContrastColor: props.active
          ? interactiveColor.active
          : props.backgroundColor,
        borderColorValue: props.active
          ? interactiveColor.outline.background
          : props.backgroundColor.foreground.primary,
      };
    case 'tertiary':
      return {
        mainContrastColor: props.backgroundColor,
        borderColorValue: props.backgroundColor.background,
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
