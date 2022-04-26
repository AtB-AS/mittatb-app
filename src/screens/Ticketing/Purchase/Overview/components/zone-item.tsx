import React from 'react';
import {View, AccessibilityProps} from 'react-native';
import ThemeText from '@atb/components/text';
import * as Sections from '@atb/components/sections';
import {StyleSheet} from '@atb/theme';

export type ZoneItemProps = {
  title: string;
  label: string;
  subLabel: string;
  onPress(): void;
  accessibility?: AccessibilityProps;
  testID?: string;
};

export default function ZoneItem({
  title,
  label,
  subLabel,
  onPress,
  testID,
  accessibility,
}: ZoneItemProps) {
  const itemStyle = useStyles();

  return (
    <View>
      <ThemeText
        type="body__secondary"
        color="secondary"
        style={itemStyle.sectionText}
      >
        {title}
      </ThemeText>
      <Sections.Section {...accessibility}>
        <Sections.ButtonInput
          label={label}
          subLabel={subLabel}
          onPress={onPress}
          testID={testID}
        />
      </Sections.Section>
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  subtitleStyle: {
    paddingTop: theme.spacings.xSmall,
  },
  sectionText: {
    marginTop: theme.spacings.xLarge,
    marginBottom: theme.spacings.medium,
  },
}));
