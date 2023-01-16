import React from 'react';
import {
  AccessibilityProps,
  AccessibilityRole,
  TouchableOpacity,
  View,
} from 'react-native';
import {Confirm} from '@atb/assets/svg/mono-icons/actions';
import {StyleSheet, Theme, useTheme} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {useSectionItem} from '../use-section-item';
import {SectionItemProps} from '../types';
import {useSectionStyle} from '../use-section-style';
import {InteractiveColor} from '@atb/theme/colors';
import {SvgProps} from 'react-native-svg';

type ActionModes = 'check';
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
          type="body__primary"
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
