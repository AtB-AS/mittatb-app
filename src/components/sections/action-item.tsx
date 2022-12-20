import React from 'react';
import {
  AccessibilityProps,
  AccessibilityRole,
  TouchableOpacity,
  View,
} from 'react-native';
import {Confirm} from '@atb/assets/svg/mono-icons/actions';
import {StyleSheet, Theme, useTheme} from '@atb/theme';
import {SectionTexts, useTranslation} from '@atb/translations';
import ThemeText from '@atb/components/text';
import ThemeIcon from '@atb/components/theme-icon';
import NavigationIcon from '@atb/components/theme-icon/navigation-icon';
import {useSectionItem, SectionItem, useSectionStyle} from './section-utils';
import InternalLabeledItem from './internals/internal-labeled-item';
import FixedSwitch from '../switch';
import {InteractiveColor} from '@atb/theme/colors';

export type ActionModes = 'check' | 'toggle' | 'heading-expand';
export type ActionItemProps = SectionItem<{
  text: string;
  subtext?: string;
  warningText?: string;
  hideSubtext?: boolean;
  onPress?(checked: boolean): void;
  checked?: boolean;
  mode?: ActionModes;
  accessibility?: AccessibilityProps;
  color?: InteractiveColor;
}>;
export default function ActionItem({
  text,
  subtext,
  warningText,
  hideSubtext,
  onPress,
  mode = 'check',
  checked = false,
  accessibility,
  testID,
  color,
  ...props
}: ActionItemProps) {
  const {contentContainer, topContainer} = useSectionItem(props);
  const style = useSectionStyle();
  const {theme} = useTheme();
  const interactiveColor = color ? theme.interactive[color] : undefined;
  const activeColor =
    interactiveColor && checked ? interactiveColor.active : undefined;
  const destructiveColor = interactiveColor
    ? interactiveColor.destructive
    : undefined;

  if (mode === 'toggle') {
    return (
      <InternalLabeledItem label={text} accessibleLabel={false} {...props}>
        <FixedSwitch
          value={checked}
          onValueChange={(value) => onPress?.(value)}
          accessibilityLabel={text}
          testID={testID}
          {...accessibility}
        />
      </InternalLabeledItem>
    );
  }

  const role: AccessibilityRole = mode === 'check' ? 'radio' : 'switch';
  const stateName = mode === 'check' ? 'selected' : 'expanded';

  return (
    <TouchableOpacity
      onPress={() => onPress?.(!checked)}
      style={[
        style.spaceBetween,
        topContainer,
        {
          backgroundColor: activeColor
            ? activeColor.background
            : topContainer.backgroundColor,
        },
      ]}
      testID={testID}
      accessibilityRole={role}
      accessibilityState={{
        [stateName]: checked,
      }}
      {...accessibility}
    >
      <View style={{flexShrink: 1}}>
        <ThemeText
          type={
            mode === 'heading-expand' ? 'body__primary--bold' : 'body__primary'
          }
          style={[
            contentContainer,
            activeColor ? {color: activeColor.text} : undefined,
          ]}
        >
          {text}
        </ThemeText>
        {subtext && !hideSubtext && (
          <ThemeText
            type="body__secondary"
            color="secondary"
            style={{marginTop: theme.spacings.small}}
          >
            {subtext}
          </ThemeText>
        )}
        {warningText && (
          <ThemeText
            type="body__secondary"
            style={{
              marginTop: theme.spacings.small,
              color: destructiveColor ? destructiveColor.background : undefined,
            }}
          >
            {warningText}
          </ThemeText>
        )}
      </View>
      <ActionModeIcon
        mode={mode}
        checked={checked}
        color={interactiveColor ? color : undefined}
      />
    </TouchableOpacity>
  );
}

function ActionModeIcon({
  mode,
  checked,
  color,
}: Pick<ActionItemProps, 'mode' | 'checked' | 'color'>) {
  const style = useHeaderExpandStyle();
  const {t} = useTranslation();
  const {theme} = useTheme();

  switch (mode) {
    case 'check': {
      return (
        <ThemeIcon
          svg={Confirm}
          {...(color
            ? {fill: theme.interactive[color].active.text}
            : undefined)}
          fillOpacity={checked ? 1 : 0}
        />
      );
    }
    case 'heading-expand': {
      const text = checked
        ? t(SectionTexts.actionItem.headingExpand.toggle.contract)
        : t(SectionTexts.actionItem.headingExpand.toggle.expand);
      const icon = checked ? 'expand-less' : 'expand-more';
      return (
        <View style={style.headerExpandIconGroup}>
          <ThemeText
            style={style.headerExpandIconGroup__text}
            type="body__secondary"
          >
            {text}
          </ThemeText>
          <NavigationIcon mode={icon} />
        </View>
      );
    }
  }
  return null;
}

const useHeaderExpandStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  headerExpandIconGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerExpandIconGroup__text: {
    marginRight: theme.spacings.xSmall,
  },
}));
