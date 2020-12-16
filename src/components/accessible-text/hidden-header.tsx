import React from 'react';
import {AccessibilityProps, Text, View} from 'react-native';
import {StyleSheet} from '../../theme';

type HiddenHeaderProps = AccessibilityProps & {
  title?: string;
  prefix?: string;
};
export default function HiddenHeader({
  title,
  prefix = '',
  ...props
}: HiddenHeaderProps) {
  return (
    <View
      accessible
      accessibilityLabel={`${prefix} ${title}\n`}
      accessibilityRole="header"
      {...props}
      style={styles.item}
    >
      <Text>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    height: 0,
    opacity: 0,
  },
});
