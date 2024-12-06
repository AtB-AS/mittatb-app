import React, {RefObject} from 'react';
import {InteractiveColor} from '@atb/theme/colors';
import {View, ViewStyle, StyleProp} from 'react-native';
import {StyleSheet, useTheme} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import {PressableOpacity} from '../pressable-opacity';

export type SegmentOptions = {
  onPress: () => void;
  text: string;
  subtext?: string;
  selected?: boolean;
  accessibilityHint?: string;
  accessibilityLabel?: string;
  ref?: RefObject<any>;
};

type RadioSegmentsProps = {
  color: InteractiveColor;
  activeIndex: number;
  options: SegmentOptions[];
  enabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function RadioSegments({
  color,
  activeIndex,
  options,
  enabled = true,
  style,
}: RadioSegmentsProps) {
  const styles = useStyles();
  const {theme} = useTheme();

  const interactiveColor = color;

  return (
    <View
      style={[
        styles.radioSegments,
        {
          backgroundColor:
            interactiveColor[enabled ? 'default' : 'disabled'].background,
        },
        style,
      ]}
    >
      {options.map((option, i) => {
        const selected = activeIndex === i;
        const currentColor = interactiveColor[selected ? 'active' : 'default'];
        const textColor = enabled
          ? currentColor.foreground.primary
          : currentColor.foreground.disabled;
        const borderWidth = selected && enabled ? theme.border.width.medium : 0;

        return (
          <PressableOpacity
            key={i}
            onPress={option.onPress}
            disabled={!enabled}
            accessible={true}
            accessibilityRole="radio"
            accessibilityState={{selected}}
            accessibilityLabel={getAccessibilityLabel(option)}
            accessibilityHint={option.accessibilityHint}
            ref={option.ref}
            style={[
              styles.optionBox,
              {
                backgroundColor: enabled ? currentColor.background : undefined,
                borderColor: interactiveColor.outline.background,
                borderWidth,
                // To make items with and without border the same size, we
                // subtract the border width from the padding.
                padding: theme.spacing.medium - borderWidth,
              },
            ]}
          >
            <ThemeText
              typography={selected ? 'body__secondary--bold' : 'body__secondary'}
              style={[styles.optionText, {color: textColor}]}
            >
              {option.text}
            </ThemeText>
            {option.subtext && (
              <ThemeText
                typography="body__secondary"
                style={[styles.optionText, {color: textColor}]}
              >
                {option.subtext}
              </ThemeText>
            )}
          </PressableOpacity>
        );
      })}
    </View>
  );
}

const getAccessibilityLabel = (option: SegmentOptions) => {
  if (option.accessibilityLabel) return option.accessibilityLabel;
  if (option.subtext) return option.text + '. ' + option.subtext;
  return option.text;
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  radioSegments: {
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  optionBox: {
    flexGrow: 1,
    width: 0,
    justifyContent: 'center',
    margin: theme.spacing.xSmall,
    borderRadius: theme.border.radius.regular,
  },
  optionText: {
    textAlign: 'center',
    flexBasis: 0,
  },
}));
