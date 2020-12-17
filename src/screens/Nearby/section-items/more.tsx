import React from 'react';
import {AccessibilityProps, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Expand} from '../../../assets/svg/icons/navigation';
import {
  SectionItem,
  useSectionItem,
  useSectionStyle,
} from '../../../components/sections/section-utils';
import ThemeText from '../../../components/text';
import ThemeIcon from '../../../components/theme-icon';
import {StyleSheet} from '../../../theme';

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
    <TouchableOpacity onPress={onPress} {...accessibility}>
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
