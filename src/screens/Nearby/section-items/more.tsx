import React, {forwardRef} from 'react';
import {AccessibilityProps, TouchableOpacityProps, View} from 'react-native';
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
const MoreItem = forwardRef<TouchableOpacity, MoreItemProps>(function MoreItem(
  {text, onPress, accessibility, ...props},
  ref,
) {
  const {contentContainer, topContainer} = useSectionItem(props);
  const sectionStyle = useSectionStyle();
  const styles = useItemStyles();
  return (
    <TouchableOpacity onPress={onPress} ref={ref} {...accessibility}>
      <View style={[topContainer, sectionStyle.spaceBetween]}>
        <ThemeText style={[styles.center, contentContainer]}>{text}</ThemeText>
        <ThemeIcon svg={Expand} />
      </View>
    </TouchableOpacity>
  );
});
export default MoreItem;

const useItemStyles = StyleSheet.createThemeHook((theme) => ({
  center: {
    textAlign: 'center',
  },
}));
