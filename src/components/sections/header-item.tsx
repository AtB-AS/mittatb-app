import React from 'react';
import {View} from 'react-native';
import ThemeText from '@atb/components/text';
import {useSectionItem, SectionItem, useSectionStyle} from './section-utils';

export type HeaderItemProps = SectionItem<{
  text: string;
  subtitle?: string;
  mode?: 'heading' | 'subheading';
}>;
export default function HeaderItem({
  text,
  subtitle,
  mode = 'heading',
  ...props
}: HeaderItemProps) {
  const {contentContainer, topContainer} = useSectionItem(props);
  const style = useSectionStyle();

  return (
    <View style={topContainer}>
      <ThemeText
        style={contentContainer}
        color={mode === 'heading' ? 'primary' : 'faded'}
        type={mode === 'heading' ? 'paragraphHeadline' : 'lead'}
      >
        {text}
      </ThemeText>
      {subtitle && (
        <ThemeText
          style={contentContainer}
          color="disabled"
          type={mode === 'heading' ? 'lead' : 'label'}
        >
          {subtitle}
        </ThemeText>
      )}
    </View>
  );
}
