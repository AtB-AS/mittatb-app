import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import {StaticColor} from '@atb/theme/colors';
import {BorderedInfoBox} from '@atb/components/bordered-info-box';

const themeColor: StaticColor = 'background_0';

export function FareContractDetail({
  header,
  content,
}: {
  header: string;
  content: string[];
}) {
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <ThemeText type="body__secondary" color="secondary">
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
    rowGap: theme.spacings.small,
  },
}));
