import React from 'react';
import {InteractiveColor} from '@atb/theme/colors';
import {View, ViewStyle, StyleProp, TouchableOpacity} from 'react-native';
import {StyleSheet, useTheme} from '@atb/theme';
import ThemeText from '../text';

export type SegmentOptions = {
  onPress: () => void;
  text: string;
  subtext?: string;
  selected?: boolean;
  accessibilityHint?: string;
};

type SegmentedControlProps = {
  color: InteractiveColor;
  activeIndex: number;
  options: SegmentOptions[];
  style?: StyleProp<ViewStyle>;
};

export default function SegmentedControl({
  color,
  activeIndex,
  options,
  style,
}: SegmentedControlProps) {
  const styles = useStyles();
  const {theme} = useTheme();

  const interactiveColor = theme.interactive[color];

  return (
    <View
      style={[
        styles.segmentedControl,
        {backgroundColor: interactiveColor.default.background},
        style,
      ]}
    >
      {options.map((option, i) => {
        const selected = activeIndex === i;
        const currentColor = interactiveColor[selected ? 'active' : 'default'];
        const borderWidth = selected ? theme.border.width.medium : 0;

        return (
          <TouchableOpacity
            onPress={option.onPress}
            accessible={true}
            accessibilityRole="button"
            accessibilityState={{selected}}
            accessibilityLabel={
              option.subtext ? option.text + '. ' + option.subtext : option.text
            }
            accessibilityHint={option.accessibilityHint}
            style={[
              styles.optionBox,
              {
                backgroundColor: currentColor.background,
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
              style={[styles.optionText, {color: currentColor.text}]}
            >
              {option.text}
            </ThemeText>
            {option.subtext && (
              <ThemeText
                type="body__secondary"
                style={[styles.optionText, {color: currentColor.text}]}
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

const useStyles = StyleSheet.createThemeHook((theme) => ({
  segmentedControl: {
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  multiSelectContainer: {
    marginTop: theme.spacings.medium,
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
