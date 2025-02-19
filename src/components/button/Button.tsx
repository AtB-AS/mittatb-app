import {ThemeText} from '@atb/components/text';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {Theme} from '@atb/theme/colors';
import React, {useRef} from 'react';
import {
  ActivityIndicator,
  Animated,
  type ColorValue,
  Easing,
  PressableProps,
  StyleProp,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {ThemeIcon, ThemeIconProps} from '@atb/components/theme-icon';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {shadows} from '@atb/components/map';
import {ContrastColor, InteractiveColor} from '@atb/theme/colors';

type ButtonMode = 'primary' | 'secondary' | 'tertiary';
type ButtonType = 'large' | 'small';

type ButtonIconProps = {
  svg: ({fill}: {fill: string}) => JSX.Element;
  size?: keyof Theme['icon']['size'];
  notification?: ThemeIconProps['notification'];
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
  PressableProps;

const DISABLED_OPACITY = 0.2;

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

  const fadeAnim = useRef(
    new Animated.Value(disabled ? DISABLED_OPACITY : 1),
  ).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: disabled ? DISABLED_OPACITY : 1,
      duration: 200,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [disabled, fadeAnim]);

  const spacing = theme.spacing.medium;

  const styleContainer: ViewStyle[] = [
    styles.button,
    {
      backgroundColor: mainContrastColor.background,
      borderColor: borderColorValue,
      paddingHorizontal: spacing,
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
    width: !expanded ? '100%' : undefined,
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
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
        },
        style,
      ]}
    >
      <PressableOpacity
        style={[styleContainer, hasShadow ? shadows : undefined]}
        onPress={disabled || loading ? undefined : onPress}
        disabled={disabled || loading}
        accessibilityRole="button"
        accessibilityState={{disabled: !!disabled}}
        ref={ref}
        {...otherProps}
      >
        {leftIcon && (
          <View style={leftStyling}>
            <ThemeIcon color={mainContrastColor} {...leftIcon} />
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
              <ActivityIndicator size="small" color={styleText.color} />
            ) : (
              rightIcon && (
                <ThemeIcon color={mainContrastColor} {...rightIcon} />
              )
            )}
          </View>
        )}
      </PressableOpacity>
    </Animated.View>
  );
});

/**
 * Get the button colors based on the input props to the button. The returned
 * mainContrastColor is the ContrastColor for the background and text of the
 * button. In addition, a borderColorValue is returned for the border color. We
 * can't really use a ContrastColor for this value since sometimes the color is
 * background color and sometimes a foreground color, based on the mode and
 * state of the button.
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
  const maxIconSize = Math.max(
    theme.icon.size[leftIcon?.size || 'normal'],
    theme.icon.size[rightIcon?.size || 'normal'],
  );
  return maxIconSize + theme.spacing.xSmall;
};

const useButtonStyle = StyleSheet.createThemeHook(() => ({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}));

function getTextType(mode: string, type: string) {
  if (type === 'small') return 'body__secondary';
  switch (mode) {
    case 'primary':
    case 'secondary':
      return 'body__primary--bold';
    case 'tertiary':
      return 'body__primary';
  }
}
