import React from 'react';
import {AccessibilityProps, ActivityIndicator, View} from 'react-native';
import {StyleSheet, Theme, useTheme} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {useSectionItem} from '../use-section-item';
import {SectionItemProps} from '../types';
import {useSectionStyle} from '../use-section-style';
import {InteractiveColor} from '@atb/theme/colors';
import {SvgProps} from 'react-native-svg';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {RadioIcon} from '@atb/components/radio';
import {PressableOpacityOrView} from '@atb/components/touchable-opacity-or-view';

type Props = SectionItemProps<{
  text: string;
  subtext?: string;
  hideSubtext?: boolean;
  onPress(checked: boolean): void;
  leftIcon?: (props: SvgProps) => JSX.Element;
  selected: boolean;
  accessibility?: AccessibilityProps;
  color?: InteractiveColor;
  rightAction?: {
    icon: (props: SvgProps) => JSX.Element;
    onPress: () => void;
    isLoading?: boolean;
  };
}>;

export function RadioSectionItem({
  text,
  subtext,
  hideSubtext,
  onPress,
  leftIcon,
  selected,
  accessibility,
  testID,
  color,
  rightAction,
  ...props
}: Props) {
  const {contentContainer, topContainer} = useSectionItem(props);
  const style = useSectionStyle();
  const styles = useStyles();
  const {theme} = useTheme();
  const interactiveColor = color;

  const backgroundColor = interactiveColor
    ? selected
      ? interactiveColor.active.background
      : interactiveColor.default.background
    : topContainer.backgroundColor;

  const textColor = interactiveColor
    ? selected
      ? interactiveColor.active.foreground.primary
      : interactiveColor.default.foreground.primary
    : theme.color.foreground.dynamic.primary;

  const selectedRadioColor = interactiveColor
    ? interactiveColor.outline.background
    : theme.color.foreground.dynamic.primary;

  return (
    <View style={[style.spaceBetween, topContainer, {backgroundColor}]}>
      <PressableOpacity
        onPress={() => onPress(!selected)}
        style={styles.mainContent}
        testID={testID}
        accessibilityRole="radio"
        accessibilityState={{selected: selected}}
        {...accessibility}
      >
        <View style={styles.radioIcon}>
          <RadioIcon checked={selected} color={selectedRadioColor || 'black'} />
        </View>
        {leftIcon && <ThemeIcon svg={leftIcon} style={styles.leftIcon} />}
        <View style={styles.textContainer}>
          <ThemeText
            type="body__primary"
            style={[contentContainer, {color: textColor}]}
          >
            {text}
          </ThemeText>
          {subtext && !hideSubtext && (
            <ThemeText
              type="body__secondary"
              color="secondary"
              style={{marginTop: theme.spacing.small}}
            >
              {subtext}
            </ThemeText>
          )}
        </View>
      </PressableOpacity>
      {rightAction && (
        <PressableOpacityOrView
          onClick={rightAction.isLoading ? undefined : rightAction.onPress}
          style={styles.rightAction}
          accessible={true}
          accessibilityRole="button"
        >
          {rightAction.isLoading ? (
            <ActivityIndicator />
          ) : (
            <ThemeIcon svg={rightAction.icon} />
          )}
        </PressableOpacityOrView>
      )}
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  mainContent: {flex: 1, flexDirection: 'row', alignItems: 'center'},
  radioIcon: {marginRight: theme.spacing.medium},
  leftIcon: {marginRight: theme.spacing.small},
  rightAction: {marginLeft: theme.spacing.medium},
  textContainer: {flex: 1},
}));
