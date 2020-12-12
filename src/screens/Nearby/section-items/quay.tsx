import React from 'react';
import {AccessibilityProps, GestureResponderEvent, View} from 'react-native';
import {WalkingPerson} from '../../../assets/svg/icons/transportation';
import {
  SectionItem,
  useSectionItem,
  useSectionStyle,
} from '../../../components/sections/section-utils';
import ThemeText from '../../../components/text';
import ThemeIcon from '../../../components/theme-icon';
import {StyleSheet} from '../../../theme';

export type QuayHeaderItemProps = SectionItem<{
  text: string;
}>;
export default function QuayHeaderItem({text, ...props}: QuayHeaderItemProps) {
  const {contentContainer, topContainer} = useSectionItem(props);
  const sectionStyle = useSectionStyle();
  const styles = useItemStyles();
  return (
    <View style={[topContainer, sectionStyle.spaceBetween, contentContainer]}>
      <ThemeText>{text}</ThemeText>
      <View style={styles.itemStyle}>
        <ThemeText>300m</ThemeText>
        <ThemeIcon svg={WalkingPerson} style={styles.icon} />
      </View>
    </View>
  );
}
const useItemStyles = StyleSheet.createThemeHook((theme) => ({
  itemStyle: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: theme.spacings.medium,
  },
}));
