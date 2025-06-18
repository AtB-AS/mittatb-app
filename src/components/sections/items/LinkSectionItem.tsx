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
import {StyleSheet} from '@atb/theme';
import {TextNames} from '@atb/theme/colors';
import {LabelType} from '@atb/modules/configuration';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {useTranslation} from '@atb/translations';
import {TagInfoTexts} from '@atb/translations/components/TagInfo';
import {Tag} from '@atb/components/tag';

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
      ...props
    },
    forwardedRef,
  ) => {
    const {t} = useTranslation();
    const {contentContainer, topContainer, interactiveColor} =
      useSectionItem(props);
    const style = useSectionStyle();
    const linkSectionItemStyle = useStyles();
    const iconEl =
      isNavigationIcon(icon) || !icon ? (
        <NavigationIcon
          mode={icon}
          fill={interactiveColor.default.foreground.primary}
        />
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
            ? `${accessibilityLabel} ${t(TagInfoTexts.labels[label])}`
            : accessibilityLabel
        }
        accessibilityState={{disabled}}
        style={topContainer}
        testID={testID}
        ref={forwardedRef}
        collapsable={false}
        {...accessibilityWithOverrides}
      >
        <View
          style={[style.spaceBetween, disabledStyle, linkSectionItemStyle.gap]}
        >
          <ThemeText
            style={[
              contentContainer,
              {color: interactiveColor.default.foreground.primary},
            ]}
            typography={textType}
          >
            {text}
          </ThemeText>
          {label && (
            <Tag
              label={[t(TagInfoTexts.labels[label])]}
              tagType="primary"
              customStyle={{alignSelf: 'center'}}
            />
          )}
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

const useStyles = StyleSheet.createThemeHook((theme) => ({
  disabled: {opacity: 0.2},
  gap: {gap: theme.spacing.small},
}));
