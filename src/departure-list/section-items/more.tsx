import {Expand} from '@atb/assets/svg/icons/navigation';
import {
  SectionItem,
  useSectionItem,
  useSectionStyle,
} from '@atb/components/sections/section-utils';
import ThemeText from '@atb/components/text';
import ThemeIcon from '@atb/components/theme-icon';
import {StyleSheet} from '@atb/theme';
import React from 'react';
import {AccessibilityProps, View, TouchableOpacity} from 'react-native';

export type MoreItemProps = SectionItem<{
  text: string;
  onPress(): void;
  accessibility?: AccessibilityProps;
}>;
export default function MoreItem({
  text,
  onPress,
  accessibility,
  ...props
}: MoreItemProps) {
  const {contentContainer, topContainer} = useSectionItem(props);
  const sectionStyle = useSectionStyle();
  const styles = useItemStyles();
  return (
    <TouchableOpacity
      onPress={onPress}
      {...accessibility}
      accessibilityRole={'button'}
    >
      <View style={[topContainer, sectionStyle.spaceBetween]}>
        <ThemeText style={[styles.center, contentContainer]}>{text}</ThemeText>
        <ThemeIcon svg={Expand} />
      </View>
    </TouchableOpacity>
  );
}
const useItemStyles = StyleSheet.createThemeHook((theme) => ({
  center: {
    textAlign: 'center',
  },
}));
