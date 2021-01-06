import React from 'react';
import {View} from 'react-native';
import {StyleSheet} from '../../theme';
import ThemeText from '../text';
import {useSectionItem, SectionItem, useSectionStyle} from './section-utils';

export type HeaderItemProps = SectionItem<{
  text: string;
  prefix?: string;
  subtitle?: string;
  mode?: 'heading' | 'subheading';
}>;
export default function HeaderItem({
  text,
  prefix,
  subtitle,
  mode = 'heading',
  ...props
}: HeaderItemProps) {
  const {contentContainer, topContainer} = useSectionItem(props);
  const style = useSectionStyle();
  const headerStyle = useHeaderStyle();

  return (
    <View style={topContainer}>
      <View style={style.spaceBetween}>
        {prefix && <ThemeText style={headerStyle.prefix}>{prefix}</ThemeText>}
        <ThemeText
          style={contentContainer}
          color={mode === 'heading' ? 'primary' : 'faded'}
          type={mode === 'heading' ? 'paragraphHeadline' : 'lead'}
        >
          {text}
        </ThemeText>
      </View>
      {subtitle && (
        <ThemeText
          style={contentContainer}
          color="faded"
          type={mode === 'heading' ? 'lead' : 'label'}
        >
          {subtitle}
        </ThemeText>
      )}
    </View>
  );
}

const useHeaderStyle = StyleSheet.createThemeHook((theme) => ({
  prefix: {
    minWidth: 60 - theme.spacings.medium,
  },
}));
