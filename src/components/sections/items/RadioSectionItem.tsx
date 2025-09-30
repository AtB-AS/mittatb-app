import React from 'react';
import {
  AccessibilityInfo,
  AccessibilityProps,
  ActivityIndicator,
  Platform,
  View,
} from 'react-native';
import {StyleSheet, Theme, useThemeContext} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {useSectionItem} from '../use-section-item';
import {SectionItemProps} from '../types';
import {useSectionStyle} from '../use-section-style';

import {SvgProps} from 'react-native-svg';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {RadioIcon} from '@atb/components/radio';
import {PressableOpacityOrView} from '@atb/components/touchable-opacity-or-view';
import {dictionary, useTranslation} from '@atb/translations';

type Props = SectionItemProps<{
  text: string;
  subtext?: string;
  onPress(checked: boolean): void;
  leftIcon?: (props: SvgProps) => React.JSX.Element;
  selected: boolean;
  rightAction?: {
    icon: (props: SvgProps) => React.JSX.Element;
    onPress: () => void;
    isLoading?: boolean;
  };
  accessibilityLabel?: AccessibilityProps['accessibilityLabel'];
  accessibilityHint?: AccessibilityProps['accessibilityHint'];
}>;

export function RadioSectionItem({
  text,
  subtext,
  onPress,
  leftIcon,
  selected,
  accessibilityLabel,
  accessibilityHint,
  testID,
  rightAction,
  ...props
}: Props) {
  const {contentContainer, topContainer} = useSectionItem({
    ...props,
    active: selected,
  });
  const style = useSectionStyle();
  const styles = useStyles();
  const {theme} = useThemeContext();
  const {t} = useTranslation();
  const color = theme.color.interactive[2];

  const textColor = selected
    ? color.active.foreground.primary
    : color.default.foreground.primary;

  const selectedRadioColor = color.outline.background;

  const a11yLabel = accessibilityLabel || `${text}, ${subtext || ''}`;

  return (
    <View style={[style.spaceBetween, topContainer]}>
      <PressableOpacity
        onPress={() => {
          // Talkback doesn't read out the updated state automatically, so we
          // trigger it manually instead.
          if (Platform.OS === 'android' && !selected) {
            AccessibilityInfo.announceForAccessibility(t(dictionary.selected));
          }
          onPress(!selected);
        }}
        style={styles.mainContent}
        testID={testID}
        accessibilityRole="radio"
        accessibilityState={{selected: !!selected}}
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
            testID={`${testID}Text`}
          >
            {text}
          </ThemeText>
          {subtext && (
            <ThemeText
              typography="body__secondary"
              color="secondary"
              style={{marginTop: theme.spacing.small}}
              testID={`${testID}SubText`}
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
