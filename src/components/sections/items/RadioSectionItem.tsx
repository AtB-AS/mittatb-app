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
import {NativeBlockButton} from '@atb/components/native-button';
import {RadioIcon} from '@atb/components/radio';
import {NativeButtonOrView} from '@atb/components/native-button-or-view';
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
    <NativeBlockButton
      onPress={() => {
        // Talkback doesn't read out the updated state automatically, so we
        // trigger it manually instead.
        if (Platform.OS === 'android' && !selected) {
          AccessibilityInfo.announceForAccessibility(t(dictionary.selected));
        }
        onPress(!selected);
      }}
      style={[styles.mainContent, topContainer]}
      testID={testID}
      // There is a bug in React Native where `accessibilityRole="radio"`
      // doesn't work consistently with VoiceOver. Using "button" until it's
      // fixed: https://github.com/facebook/react-native/issues/43266
      accessibilityRole="button"
      accessibilityState={{selected: !!selected}}
      accessibilityLabel={a11yLabel}
      accessibilityHint={accessibilityHint}
    >
      <View style={style.spaceBetween}>
        <View style={styles.radioIcon}>
          <RadioIcon checked={selected} color={selectedRadioColor || 'black'} />
        </View>
        {leftIcon && <ThemeIcon svg={leftIcon} style={styles.leftIcon} />}
        <View style={styles.textContainer}>
          <ThemeText
            typography="body__m"
            style={[contentContainer, {color: textColor}]}
            testID={`${testID}Text`}
          >
            {text}
          </ThemeText>
          {subtext && (
            <ThemeText
              typography="body__s"
              color="secondary"
              style={{marginTop: theme.spacing.small}}
              testID={`${testID}SubText`}
            >
              {subtext}
            </ThemeText>
          )}
        </View>
        {rightAction && (
          <NativeButtonOrView
            onClick={rightAction.isLoading ? undefined : rightAction.onPress}
            style={styles.rightAction}
            accessible={true}
            accessibilityRole="button"
            type="borderless"
          >
            {rightAction.isLoading ? (
              <ActivityIndicator />
            ) : (
              <ThemeIcon svg={rightAction.icon} />
            )}
          </NativeButtonOrView>
        )}
      </View>
    </NativeBlockButton>
  );
}

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  mainContent: {flex: 1, flexDirection: 'row', alignItems: 'center'},
  radioIcon: {marginRight: theme.spacing.medium},
  leftIcon: {marginRight: theme.spacing.small},
  rightAction: {marginLeft: theme.spacing.medium},
  textContainer: {flex: 1},
}));
