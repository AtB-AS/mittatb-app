import React, {forwardRef} from 'react';
import {AccessibilityProps, View} from 'react-native';
import {ThemeText, screenReaderPause} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {useSectionItem} from '../use-section-item';
import {SectionItemProps} from '../types';
import {useSectionStyle} from '../use-section-style';
import {StyleSheet} from '@atb/theme';
import {ContrastColor, InteractiveColor, TextNames} from '@atb/theme/colors';
import {LabelType} from '@atb/modules/configuration';
import {NativeButton} from '@atb/components/native-button';
import {useTranslation} from '@atb/translations';
import {TagInfoTexts} from '@atb/translations/components/TagInfo';
import {Tag} from '@atb/components/tag';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {IconColor} from '@atb/components/theme-icon';

type IconProps = {
  svg: ({fill}: {fill: string}) => React.JSX.Element;
  color?: IconColor;
  notificationColor?: ContrastColor;
};

type Props = SectionItemProps<{
  text: string;
  subtitle?: string;
  /* Label will be placed by the icon. "Beta", "New", etc. */
  label?: LabelType;
  onPress?(): void;
  leftIcon?: IconProps;
  rightIcon?: IconProps;
  disabled?: boolean;
  accessibility?: AccessibilityProps;
  textType?: TextNames;
  isMarkdown?: boolean;
}>;

export const LinkSectionItem = forwardRef<any, Props>(
  (
    {
      text,
      onPress,
      subtitle,
      label,
      leftIcon,
      rightIcon = {svg: ArrowRight},
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
    const disabledStyle = disabled ? linkSectionItemStyle.disabled : undefined;
    const accessibilityWithOverrides = disabled
      ? {...accessibility, accessibilityHint: undefined}
      : accessibility;
    const accessibilityLabel =
      accessibilityWithOverrides?.accessibilityLabel ??
      text + screenReaderPause + (subtitle ? subtitle + screenReaderPause : '');
    return (
      <NativeButton
        accessible
        accessibilityRole="button"
        onPress={disabled ? undefined : onPress}
        disabled={disabled}
        accessibilityLabel={
          label
            ? `${accessibilityLabel} ${t(TagInfoTexts.labels[label].a11y)}`
            : accessibilityLabel
        }
        accessibilityState={{disabled}}
        style={topContainer}
        testID={testID}
        ref={forwardedRef}
        {...accessibilityWithOverrides}
      >
        <View
          style={[style.spaceBetween, disabledStyle, linkSectionItemStyle.gap]}
        >
          {leftIcon && (
            <Icon icon={leftIcon} interactiveColor={interactiveColor} />
          )}
          <View style={linkSectionItemStyle.textContainer}>
            <ThemeText
              style={[
                contentContainer,
                {color: interactiveColor.default.foreground.primary},
              ]}
              typography={textType}
              isMarkdown={props.isMarkdown}
            >
              {text}
            </ThemeText>
          </View>
          {label && (
            <Tag
              labels={[t(TagInfoTexts.labels[label].text)]}
              tagType="primary"
              customStyle={linkSectionItemStyle.tag}
            />
          )}
          {rightIcon && (
            <Icon icon={rightIcon} interactiveColor={interactiveColor} />
          )}
        </View>
        {subtitle && (
          <View style={disabledStyle}>
            <ThemeText color="secondary" typography="body__s">
              {subtitle}
            </ThemeText>
          </View>
        )}
      </NativeButton>
    );
  },
);

const Icon = ({
  icon,
  interactiveColor,
}: {
  icon: IconProps;
  interactiveColor: InteractiveColor;
}) => {
  return (
    <ThemeIcon
      svg={icon.svg}
      color={icon.color}
      notification={
        icon.notificationColor
          ? {
              color: icon.notificationColor,
              backgroundColor: interactiveColor.default,
            }
          : undefined
      }
    />
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  disabled: {opacity: 0.2},
  gap: {gap: theme.spacing.small},
  tag: {
    alignSelf: 'center',
    // Slight hack to prevent the section item from growing beyond normal size
    // to fit the tag.
    marginVertical: -theme.spacing.xSmall,
  },
  textContainer: {flex: 1},
}));
