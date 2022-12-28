import {ThemeText} from '@atb/components/text';
import React from 'react';
import {View} from 'react-native';
import {SectionItem, useSectionItem} from './section-utils';

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

  return (
    <View style={topContainer}>
      <ThemeText
        style={contentContainer}
        type={mode === 'heading' ? 'body__primary--bold' : 'body__secondary'}
      >
        {text}
      </ThemeText>
      {subtitle && (
        <ThemeText
          style={contentContainer}
          color="secondary"
          type={mode === 'heading' ? 'body__secondary' : 'body__tertiary'}
        >
          {subtitle}
        </ThemeText>
      )}
    </View>
  );
}
