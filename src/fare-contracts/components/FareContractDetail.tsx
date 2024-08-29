import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import {useTheme} from '@atb/theme';
import {BorderedInfoBox} from '@atb/components/bordered-info-box';

export function FareContractDetail({
  header,
  content,
}: {
  header: string;
  content: string[];
}) {
  const styles = useStyles();
  const {theme} = useTheme();

  const themeColor = theme.color.background.neutral[0]
  const textColor = theme.text.colors['secondary']

  return (
    <View style={styles.container}>
      <ThemeText type="body__secondary" color={textColor}>
        {header}
      </ThemeText>
      {content.map((c) => (
        <BorderedInfoBox
          type="small"
          text={c}
          key={c}
          backgroundColor={themeColor}
        />
      ))}
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    rowGap: theme.spacing.small,
  },
}));
