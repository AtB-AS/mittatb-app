import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import {InteractiveColor} from '@atb/theme/colors';
import {InfoChip} from '@atb/components/info-chip';

const themeColor: InteractiveColor = 'interactive_2';

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
      <View style={styles.content}>
        <ThemeText type="body__secondary" color={'secondary'}>
          {header}
        </ThemeText>
        {content.map((c) => (
          <InfoChip text={c} key={c} interactiveColor={themeColor} />
        ))}
      </View>
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flexDirection: 'row',
  },
  content: {
    rowGap: theme.spacings.small,
  },
}));
