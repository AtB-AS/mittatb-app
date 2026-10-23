import React, {RefObject} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import {NativeTouchable} from '../native-touchable';
import {useTranslation} from '@atb/translations';
import {getRadioA11y} from '@atb/components/radio';

export type SegmentOptions = {
  onPress: () => void;
  text: string;
  accessibilityHint?: string;
  accessibilityLabel?: string;
  ref?: RefObject<any>;
  testID?: string;
};

type RadioSegmentsProps = {
  activeIndex: number;
  options: SegmentOptions[];
  style?: StyleProp<ViewStyle>;
  /**
   * Use 'tab' when the segments switch between tabs. Defaults to radio
   * semantics.
   */
  accessibilityRole?: 'radio' | 'tab';
};

export function RadioSegments({
  activeIndex,
  options,
  style,
  accessibilityRole = 'radio',
}: RadioSegmentsProps) {
  const styles = useStyles();
  const {theme} = useThemeContext();
  const {t} = useTranslation();

  return (
    <View style={[styles.radioSegments, style]}>
      {options.map((option, i) => {
        const selected = activeIndex === i;
        const textColor = selected
          ? theme.color.surface.accent.subtle
          : theme.color.surface.neutral.strong;
        const a11yLabel = getAccessibilityLabel(option);

        return (
          <NativeTouchable
            variant="block"
            key={i}
            onPress={option.onPress}
            pressedColor={theme.color.surface.accent.subtlePressed.background}
            accessible={true}
            {...(accessibilityRole === 'tab'
              ? {
                  accessibilityRole: 'tab',
                  accessibilityLabel: a11yLabel,
                  accessibilityState: {selected},
                }
              : getRadioA11y(a11yLabel, selected, t))}
            accessibilityHint={option.accessibilityHint}
            ref={option.ref}
            style={[styles.optionBox, selected && styles.optionBoxSelected]}
            testID={
              option.testID ??
              `${option.text.toLowerCase().replaceAll(' ', '')}Button`
            }
          >
            <ThemeText
              typography={selected ? 'body__m__strong' : 'body__m'}
              color={textColor}
              style={styles.optionText}
            >
              {option.text}
            </ThemeText>
          </NativeTouchable>
        );
      })}
    </View>
  );
}

const getAccessibilityLabel = (option: SegmentOptions) => {
  if (option.accessibilityLabel) return option.accessibilityLabel;
  return option.text;
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  radioSegments: {
    borderRadius: theme.border.radius.circle,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: theme.spacing.xSmall,
    backgroundColor: theme.color.surface.neutral.strong.background,
  },
  optionBox: {
    flexGrow: 1,
    width: 0,
    minHeight: 44,
    justifyContent: 'center',
    borderRadius: theme.border.radius.circle,
    padding: theme.spacing.small,
    borderWidth: theme.border.width.medium,
    borderColor: 'transparent',
    backgroundColor: theme.color.surface.neutral.strong.background,
  },
  optionBoxSelected: {
    backgroundColor: theme.color.surface.accent.subtle.background,
    borderColor: theme.color.surface.accent.strong.background,
  },
  optionText: {
    textAlign: 'center',
  },
}));
