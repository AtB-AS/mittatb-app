import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import {useThemeContext} from '@atb/theme';
import {BorderedInfoBox} from '@atb/components/bordered-info-box';

export function FareContractDetailItem({
  header,
  content,
}: {
  header?: string;
  content: string[];
}) {
  const styles = useStyles();
  const {theme} = useThemeContext();

  const themeColor = theme.color.background.neutral[0];
  const textColor = theme.color.foreground.dynamic.secondary;

  return (
    <View style={styles.container}>
      {header && (
        <ThemeText typography="body__s" color={textColor}>
          {header}
        </ThemeText>
      )}
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
