import {ThemeText} from '@atb/components/text';
import React from 'react';
import {View} from 'react-native';
import {useSectionItem} from '../use-section-item';
import {SectionItemProps} from '../types';
import {StyleSheet} from '@atb/theme';

type Props = SectionItemProps<{
  text: string;
  subtitle?: string;
  mode?: 'heading' | 'subheading';
}>;

export function HeaderSectionItem({
  text,
  subtitle,
  mode = 'heading',
  ...props
}: Props) {
  const {contentContainer, topContainer} = useSectionItem(props);
  const styles = useStyles();

  return (
    <View style={topContainer}>
      <ThemeText
        style={contentContainer}
        typography={
          mode === 'heading' ? 'body__primary--bold' : 'body__secondary'
        }
      >
        {text}
      </ThemeText>
      {subtitle && (
        <ThemeText
          style={[styles.subtitle, contentContainer]}
          color="secondary"
          typography={mode === 'heading' ? 'body__secondary' : 'body__tertiary'}
        >
          {subtitle}
        </ThemeText>
      )}
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  subtitle: {
    paddingTop: theme.spacing.small,
  },
}));
