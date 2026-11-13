import React, {forwardRef, ReactNode} from 'react';
import {AccessibilityProps, View} from 'react-native';
import {ThemeText, screenReaderPause} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {useSectionItem} from '../use-section-item';
import {SectionItemProps} from '../types';
import {useSectionStyle} from '../use-section-style';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {ContrastColor, TextNames} from '@atb/theme/colors';
import {LabelType} from '@atb/modules/configuration';
import {NativeTouchable} from '@atb/components/native-touchable';
import {useTranslation} from '@atb/translations';
import {TagInfoTexts} from '@atb/translations/components/TagInfo';
import {NotificationBadgeTexts} from '@atb/translations/components/NotificationBadge';
import {NotificationBadge} from '@atb/components/notification-badge';
import {Tag} from '@atb/components/tag';
import {ChevronRight} from '@atb/assets/svg/mono-icons/navigation';
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
  /** Shows a notification badge with this count before the right icon */
  notificationCount?: number;
  onPress?(): void;
  leftIcon?: IconProps;
  leftElement?: ReactNode;
  rightIcon?: IconProps;
  buttonTextRight?: string;
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
      notificationCount,
      leftIcon,
      rightIcon = {svg: ChevronRight},
      buttonTextRight,
      accessibility,
      disabled,
      textType,
      testID,
      leftElement,
      ...props
    },
    forwardedRef,
  ) => {
    const {t} = useTranslation();
    const {theme} = useThemeContext();
    const {contentContainer, topContainer} = useSectionItem(props);
    const style = useSectionStyle();
    const linkSectionItemStyle = useStyles();
    // The custom label is left out of the spread further down, so it doesn't
    // override the notification count added to it below
    const {
      accessibilityLabel: customAccessibilityLabel,
      ...otherAccessibility
    } = accessibility ?? {};
    const accessibilityWithOverrides = disabled
      ? {...otherAccessibility, accessibilityHint: undefined}
      : otherAccessibility;
    const accessibilityLabel =
      (customAccessibilityLabel ??
        text +
          screenReaderPause +
          (subtitle ? subtitle + screenReaderPause : '')) +
      (notificationCount
        ? t(NotificationBadgeTexts.a11yLabel(notificationCount)) +
          screenReaderPause
        : '');

    const leftAccessory =
      leftElement ?? (leftIcon ? <Icon icon={leftIcon} /> : null);

    return (
      <NativeTouchable
        variant="block"
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
        <View style={[style.spaceBetween, linkSectionItemStyle.gap]}>
          {leftAccessory}
          <View style={[linkSectionItemStyle.textContainer, contentContainer]}>
            <ThemeText
              color={theme.color.surface.neutral.strong}
              typography={textType}
              isMarkdown={props.isMarkdown}
            >
              {text}
            </ThemeText>
            {subtitle && (
              <View>
                <ThemeText type="secondary" typography="body__s">
                  {subtitle}
                </ThemeText>
              </View>
            )}
          </View>
          {label && (
            <Tag
              labels={[t(TagInfoTexts.labels[label].text)]}
              tagType="primary"
              customStyle={linkSectionItemStyle.tag}
            />
          )}
          {!!notificationCount && (
            <View style={linkSectionItemStyle.notificationBadge}>
              <NotificationBadge count={notificationCount} />
            </View>
          )}
          <View style={linkSectionItemStyle.rightContainer}>
            {buttonTextRight && (
              <ThemeText typography="body__s">{buttonTextRight}</ThemeText>
            )}
            {rightIcon && <Icon icon={rightIcon} />}
          </View>
        </View>
      </NativeTouchable>
    );
  },
);

const Icon = ({icon}: {icon: IconProps}) => {
  const {theme} = useThemeContext();
  return (
    <ThemeIcon
      svg={icon.svg}
      color={icon.color}
      notification={
        icon.notificationColor
          ? {
              color: icon.notificationColor,
              backgroundColor: theme.color.surface.neutral.strong,
            }
          : undefined
      }
    />
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xSmall,
  },
  disabled: {opacity: 0.2},
  gap: {gap: theme.spacing.small},
  tag: {
    alignSelf: 'center',
    // Slight hack to prevent the section item from growing beyond normal size
    // to fit the tag.
    marginVertical: -theme.spacing.xSmall,
  },
  notificationBadge: {
    alignSelf: 'center',
    // Together with the gap, gives medium spacing to the right icon
    marginRight: theme.spacing.xSmall,
  },
  textContainer: {flex: 1},
}));
