import React from 'react';
import {AccessibilityProps, ActivityIndicator, View} from 'react-native';
import {StyleSheet, Theme, useThemeContext} from '@atb/theme';
import {screenReaderPause, ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {useSectionItem} from '../use-section-item';
import {SectionItemProps} from '../types';
import {useSectionStyle} from '../use-section-style';
import {InteractiveColor} from '@atb/theme/colors';
import {SvgProps} from 'react-native-svg';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {RadioIcon} from '@atb/components/radio';
import {PressableOpacityOrView} from '@atb/components/touchable-opacity-or-view';
import {dictionary, useTranslation} from '@atb/translations';

type Props = SectionItemProps<{
  text: string;
  subtext?: string;
  hideSubtext?: boolean;
  onPress(checked: boolean): void;
  leftIcon?: (props: SvgProps) => JSX.Element;
  selected: boolean;
  color?: InteractiveColor;
  rightAction?: {
    icon: (props: SvgProps) => JSX.Element;
    onPress: () => void;
    isLoading?: boolean;
  };
  accessibilityLabel?: AccessibilityProps['accessibilityLabel'];
  accessibilityHint?: AccessibilityProps['accessibilityHint'];
}>;

export function RadioSectionItem({
  text,
  subtext,
  hideSubtext,
  onPress,
  leftIcon,
  selected,
  accessibilityLabel,
  accessibilityHint,
  testID,
  color,
  rightAction,
  ...props
}: Props) {
  const {contentContainer, topContainer} = useSectionItem(props);
  const style = useSectionStyle();
  const styles = useStyles();
  const {theme} = useThemeContext();
  const {t} = useTranslation();
  const interactiveColor = color || theme.color.interactive[2];

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

  const a11yLabel =
    (accessibilityLabel || `${text}, ${hideSubtext ? '' : subtext}`) +
    screenReaderPause +
    t(selected ? dictionary.selected : dictionary.unselected);

  return (
    <View style={[style.spaceBetween, topContainer, {backgroundColor}]}>
      <PressableOpacity
        onPress={() => onPress(!selected)}
        style={styles.mainContent}
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={a11yLabel}
        accessibilityHint={accessibilityHint}
      >
        <View style={styles.radioIcon}>
          <RadioIcon checked={selected} color={selectedRadioColor || 'black'} />
        </View>
        {leftIcon && <ThemeIcon svg={leftIcon} style={styles.leftIcon} />}
        <View style={styles.textContainer}>
          <ThemeText
            typography="body__primary"
            style={[contentContainer, {color: textColor}]}
          >
            {text}
          </ThemeText>
          {subtext && !hideSubtext && (
            <ThemeText
              typography="body__secondary"
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
