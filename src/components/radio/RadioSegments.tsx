import React from 'react';
import {InteractiveColor} from '@atb/theme/colors';
import {View, ViewStyle, StyleProp, TouchableOpacity} from 'react-native';
import {StyleSheet, useTheme} from '@atb/theme';
import {ThemeText} from '@atb/components/text';

export type SegmentOptions = {
  onPress: () => void;
  text: string;
  subtext?: string;
  selected?: boolean;
  accessibilityHint?: string;
  accessibilityLabel?: string;
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

  const interactiveColor = theme.interactive[color];

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
          ? currentColor.text
          : theme.text.colors.disabled;
        const borderWidth = selected && enabled ? theme.border.width.medium : 0;

        return (
          <TouchableOpacity
            key={i}
            onPress={option.onPress}
            disabled={!enabled}
            accessible={true}
            accessibilityRole="radio"
            accessibilityState={{selected}}
            accessibilityLabel={getAccessibilityLabel(option)}
            accessibilityHint={option.accessibilityHint}
            style={[
              styles.optionBox,
              {
                backgroundColor: enabled ? currentColor.background : undefined,
                borderColor: interactiveColor.outline.background,
                borderWidth,
                // To make items with and without border the same size, we
                // subtract the border width from the padding.
                padding: theme.spacings.medium - borderWidth,
              },
            ]}
          >
            <ThemeText
              type={selected ? 'body__secondary--bold' : 'body__secondary'}
              style={[styles.optionText, {color: textColor}]}
            >
              {option.text}
            </ThemeText>
            {option.subtext && (
              <ThemeText
                type="body__secondary"
                style={[styles.optionText, {color: textColor}]}
              >
                {option.subtext}
              </ThemeText>
            )}
          </TouchableOpacity>
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
    margin: theme.spacings.xSmall,
    borderRadius: theme.border.radius.regular,
  },
  optionText: {
    textAlign: 'center',
    flexBasis: 0,
  },
}));
