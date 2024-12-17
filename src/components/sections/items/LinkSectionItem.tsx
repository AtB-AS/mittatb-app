import React, {forwardRef} from 'react';
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
import {StyleSheet, useThemeContext} from '@atb/theme';
import {InteractiveColor, TextNames} from '@atb/theme/colors';
import {LabelInfo} from '@atb/components/label-info';
import {LabelType} from '@atb/configuration';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {useTranslation} from '@atb/translations';
import {LabelInfoTexts} from '@atb/translations/components/LabelInfo';

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

export const LinkSectionItem = forwardRef<any, Props>(
  (
    {
      text,
      onPress,
      subtitle,
      label,
      icon,
      accessibility,
      disabled,
      textType,
      testID,
      interactiveColor,
      ...props
    },
    forwardedRef,
  ) => {
    const {t} = useTranslation();
    const {contentContainer, topContainer} = useSectionItem(props);
    const style = useSectionStyle();
    const linkSectionItemStyle = useStyles();
    const {theme} = useThemeContext();
    const themeColor =
      interactiveColor?.default ?? theme.color.interactive[2].default;
    const iconEl =
      isNavigationIcon(icon) || !icon ? (
        <NavigationIcon mode={icon} fill={themeColor.foreground.primary} />
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
        accessibilityRole="button"
        onPress={disabled ? undefined : onPress}
        disabled={disabled}
        accessibilityLabel={
          label
            ? `${accessibilityLabel} ${t(LabelInfoTexts.labels[label])}`
            : accessibilityLabel
        }
        accessibilityState={{disabled}}
        style={[topContainer, {backgroundColor: themeColor.background}]}
        testID={testID}
        ref={forwardedRef}
        collapsable={false}
        {...accessibilityWithOverrides}
      >
        <View style={[style.spaceBetween, disabledStyle]}>
          <ThemeText
            style={[contentContainer, {color: themeColor.foreground.primary}]}
            typography={textType}
          >
            {text}
          </ThemeText>
          {label && <LabelInfo label={label} />}
          {iconEl}
        </View>
        {subtitle && (
          <View style={disabledStyle}>
            <ThemeText color="secondary" typography="body__secondary">
              {subtitle}
            </ThemeText>
          </View>
        )}
      </PressableOpacity>
    );
  },
);

const useStyles = StyleSheet.createThemeHook(() => ({
  disabled: {opacity: 0.2},
}));
