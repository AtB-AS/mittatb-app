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
import {ThemeText} from '@atb/components/text';
import {NavigationIcon, ThemeIcon} from '@atb/components/theme-icon';
import {useSectionItem} from '../use-section-item';
import {SectionItemProps} from '../types';
import {useSectionStyle} from '../use-section-style';
import {InternalLabeledSectionItem} from './InternalLabeledSectionItem';
import {FixedSwitch} from '@atb/components/switch';
import {InteractiveColor} from '@atb/theme/colors';
import {SvgProps} from 'react-native-svg';

type ActionModes = 'check' | 'toggle' | 'heading-expand';
type Props = SectionItemProps<{
  text: string;
  subtext?: string;
  hideSubtext?: boolean;
  onPress(checked: boolean): void;
  leftIcon?: (props: SvgProps) => JSX.Element;
  checked?: boolean;
  mode?: ActionModes;
  accessibility?: AccessibilityProps;
  color?: InteractiveColor;
}>;
export function ActionSectionItem({
  text,
  subtext,
  hideSubtext,
  onPress,
  leftIcon,
  mode = 'check',
  checked = false,
  accessibility,
  testID,
  color,
  ...props
}: Props) {
  const {contentContainer, topContainer} = useSectionItem(props);
  const style = useSectionStyle();
  const styles = useStyles();
  const {theme} = useTheme();
  const interactiveColor =
    color && checked ? theme.interactive[color].active : undefined;

  if (mode === 'toggle') {
    return (
      <InternalLabeledSectionItem
        label={text}
        leftIcon={leftIcon}
        accessibleLabel={false}
        subtext={hideSubtext ? undefined : subtext}
        {...props}
      >
        <FixedSwitch
          value={checked}
          onValueChange={(value) => onPress?.(value)}
          accessibilityLabel={text + (subtext ? ',' + subtext : '')}
          testID={testID}
          {...accessibility}
        />
      </InternalLabeledSectionItem>
    );
  }

  const role: AccessibilityRole = mode === 'check' ? 'radio' : 'switch';
  const stateName = mode === 'check' ? 'selected' : 'expanded';

  return (
    <TouchableOpacity
      onPress={() => onPress(!checked)}
      style={[
        style.spaceBetween,
        topContainer,
        {
          backgroundColor: interactiveColor
            ? interactiveColor.background
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
      {leftIcon && <ThemeIcon svg={leftIcon} style={styles.leftIcon} />}
      <View style={{flexShrink: 1}}>
        <ThemeText
          type={
            mode === 'heading-expand' ? 'body__primary--bold' : 'body__primary'
          }
          style={[
            contentContainer,
            interactiveColor ? {color: interactiveColor.text} : undefined,
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
}: Pick<Props, 'mode' | 'checked' | 'color'>) {
  const styles = useStyles();
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
        ? t(SectionTexts.actionSectionItem.headingExpand.toggle.contract)
        : t(SectionTexts.actionSectionItem.headingExpand.toggle.expand);
      const icon = checked ? 'expand-less' : 'expand-more';
      return (
        <View style={styles.headerExpandIconGroup}>
          <ThemeText
            style={styles.headerExpandIconGroup__text}
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

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  headerExpandIconGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerExpandIconGroup__text: {
    marginRight: theme.spacings.xSmall,
  },
  leftIcon: {
    marginRight: theme.spacings.small,
  },
}));
