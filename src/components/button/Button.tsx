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

type ButtonSettings = {
  withBackground: boolean;
  visibleBorder: boolean;
};

const DefaultModeStyles: {[key in ButtonMode]: ButtonSettings} = {
  primary: {
    withBackground: true,
    visibleBorder: false,
  },
  secondary: {
    withBackground: false,
    visibleBorder: true,
  },
  tertiary: {
    withBackground: false,
    visibleBorder: false,
  },
};

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

export const Button = React.forwardRef<any, ButtonProps>(
  (
    {
      onPress,
      mode = 'primary',
      type = 'large',
      leftIcon,
      rightIcon,
      text,
      disabled,
      active,
      loading = false,
      expanded,
      hasShadow = false,
      style,
      ...props
    },
    ref,
  ) => {
    const modeData = DefaultModeStyles[mode];
    const styles = useButtonStyle();
    const {theme} = useThemeContext();

    const interactiveColor = props.interactiveColor
      ? props.interactiveColor
      : theme.color.interactive[0];
    const backgroundColor =
      'backgroundColor' in props
        ? props.backgroundColor
        : theme.color.background.neutral[0];

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
    const {background: buttonColor} =
      interactiveColor[active ? 'active' : 'default'];

    const textColorBasedOnBackground = backgroundColor.foreground.primary;
    const textColor =
      mode !== 'primary'
        ? textColorBasedOnBackground
        : interactiveColor[active ? 'active' : 'default'].foreground.primary;

    const borderColor =
      active && mode !== 'tertiary'
        ? interactiveColor.outline.background
        : modeData.visibleBorder
        ? textColor
        : 'transparent';

    const backgroundColorValue: ColorValue =
      active && mode !== 'tertiary'
        ? buttonColor
        : modeData.withBackground
        ? buttonColor
        : 'transparent';

    const styleContainer: ViewStyle[] = [
      styles.button,
      {
        backgroundColor: backgroundColorValue,
        borderColor: borderColor,
        paddingHorizontal: spacing,
        paddingVertical: type === 'small' ? theme.spacing.xSmall : spacing,
        borderRadius: theme.border.radius.circle,
        borderWidth:
          type === 'small'
            ? theme.border.width.slim
            : theme.border.width.medium,
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
      color: textColor,
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
          {...props}
        >
          {leftIcon && (
            <View style={leftStyling}>
              <ThemeIcon color={textColor} {...leftIcon} />
            </View>
          )}
          {text && (
            <View style={textContainer}>
              <ThemeText
                typography={getTextType(mode, type)}
                style={styleText}
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
                rightIcon && <ThemeIcon color={textColor} {...rightIcon} />
              )}
            </View>
          )}
        </PressableOpacity>
      </Animated.View>
    );
  },
);

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
