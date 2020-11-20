import React from 'react';
import {View} from 'react-native';
import ThemeText from '../text';
import {useSectionItem, SectionItem, useSectionStyle} from './section-utils';

export type HeaderItemProps = SectionItem<{
  text: string;
  subline?: string;
  mode?: 'heading' | 'subheading';
}>;
export default function HeaderItem({
  text,
  subline,
  mode = 'heading',
  ...props
}: HeaderItemProps) {
  const {contentContainer, topContainer} = useSectionItem(props);
  const style = useSectionStyle();

  return (
    <View style={[style.baseItem, topContainer]}>
      <ThemeText
        style={contentContainer}
        color={mode === 'heading' ? 'primary' : 'faded'}
        type={mode === 'heading' ? 'paragraphHeadline' : 'lead'}
      >
        {text}
      </ThemeText>
      {subline && (
        <ThemeText
          style={contentContainer}
          color="faded"
          type={mode === 'heading' ? 'lead' : 'label'}
        >
          {subline}
        </ThemeText>
      )}
    </View>
  );
}
