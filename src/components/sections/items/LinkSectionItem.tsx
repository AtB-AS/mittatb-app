import React from 'react';
import {AccessibilityProps, GestureResponderEvent, View} from 'react-native';
import {ThemeText, screenReaderPause} from '@atb/components/text';
import {
  NavigationIcon,
  isNavigationIcon,
  NavigationIconTypes,
} from '@atb/components/theme-icon';
import {useSectionItem} from '../use-section-item';
import {SectionItemProps} from '../types';
import {useSectionStyle} from '../use-section-style';
import {StyleSheet, useTheme} from '@atb/theme';
import {InteractiveColor, TextNames} from '@atb/theme/colors';
import {LabelInfo} from '@atb/components/label-info';
import {LabelType} from '@atb/configuration';
import {PressableOpacity} from '@atb/components/pressable-opacity';

type Props = SectionItemProps<{
  text: string;
  subtitle?: string;
  /* Label will be placed by the icon. "Beta", "New", etc. */
  label?: LabelType;
  onPress?(event: GestureResponderEvent): void;
  icon?: NavigationIconTypes | JSX.Element;
  disabled?: boolean;
  accessibility?: AccessibilityProps;
  textType?: TextNames;
  interactiveColor?: InteractiveColor;
}>;
export function LinkSectionItem({
  text,
  onPress,
  subtitle,
  label,
  icon,
  accessibility,
  disabled,
  textType,
  testID,
  interactiveColor = 'interactive_2',
  ...props
}: Props) {
  const {contentContainer, topContainer} = useSectionItem(props);
  const style = useSectionStyle();
  const linkSectionItemStyle = useStyles();
  const {theme} = useTheme();
  const themeColor = theme.interactive[interactiveColor].default;
  const iconEl =
    isNavigationIcon(icon) || !icon ? (
      <NavigationIcon mode={icon} fill={themeColor.text} />
    ) : (
      icon
    );
  const disabledStyle = disabled ? linkSectionItemStyle.disabled : undefined;
  const accessibilityWithOverrides = disabled
    ? {...accessibility, accessibilityHint: undefined}
    : accessibility;
  const accessibilityLabel =
    text + screenReaderPause + (subtitle ? subtitle + screenReaderPause : '');
  return (
    <PressableOpacity
      accessible
      accessibilityRole="link"
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      accessibilityLabel={
        label ? `${accessibilityLabel} ${label}` : accessibilityLabel
      }
      accessibilityState={{disabled}}
      style={[topContainer, {backgroundColor: themeColor.background}]}
      testID={testID}
      {...accessibilityWithOverrides}
    >
      <View style={[style.spaceBetween, disabledStyle]}>
        <ThemeText
          style={[contentContainer, {color: themeColor.text}]}
          type={textType}
        >
          {text}
        </ThemeText>
        {label && <LabelInfo label={label} />}
        {iconEl}
      </View>
      {subtitle && (
        <View style={disabledStyle}>
          <ThemeText color="secondary" type="body__secondary">
            {subtitle}
          </ThemeText>
        </View>
      )}
    </PressableOpacity>
  );
}

const useStyles = StyleSheet.createThemeHook(() => ({
  disabled: {opacity: 0.2},
}));
