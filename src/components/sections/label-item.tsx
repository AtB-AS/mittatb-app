import React from 'react';
import {View} from 'react-native';
import {StyleSheet} from '../../theme';
import ThemeText from '../text';
import {useSectionItem, SectionItem, useSectionStyle} from './section-utils';

export type LabelItemProps = SectionItem<{
  text: string;
  prefix?: string;
}>;
export default function LabelItem({text, prefix, ...props}: LabelItemProps) {
  const {contentContainer, topContainer} = useSectionItem(props);
  const style = useSectionStyle();
  const headerStyle = useHeaderStyle();

  return (
    <View style={topContainer}>
      <View style={style.spaceBetween}>
        {prefix && <ThemeText style={headerStyle.prefix}>{prefix}</ThemeText>}
        <ThemeText style={contentContainer}>{text}</ThemeText>
      </View>
    </View>
  );
}

const useHeaderStyle = StyleSheet.createThemeHook((theme) => ({
  prefix: {
    minWidth: 60 - theme.spacings.medium,
  },
}));
