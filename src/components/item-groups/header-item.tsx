import React from 'react';
import {View} from 'react-native';
import ThemeText from '../text';
import useListStyle from './style';

export type HeaderItemProps = {
  title: string;
  subline?: string;
  mode?: 'heading' | 'subheading';
};
export default function HeaderItem({
  title,
  subline,
  mode = 'heading',
}: HeaderItemProps) {
  const style = useListStyle();
  return (
    <View style={style.baseItem}>
      <ThemeText
        color={mode === 'heading' ? 'primary' : 'faded'}
        type={mode === 'heading' ? 'paragraphHeadline' : 'lead'}
      >
        {title}
      </ThemeText>
      {subline && (
        <ThemeText color="faded" type={mode === 'heading' ? 'lead' : 'label'}>
          {subline}
        </ThemeText>
      )}
    </View>
  );
}
