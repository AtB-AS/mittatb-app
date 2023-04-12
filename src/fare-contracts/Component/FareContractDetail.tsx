import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import {InteractiveColor} from '@atb/theme/colors';
import {InfoChip} from '@atb/components/info-chip';

const themeColor: InteractiveColor = 'interactive_2';

function FareContractDetail({
  header,
  content,
}: {
  header: string;
  content: string[];
}) {
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <View>
        <ThemeText
          type="body__secondary"
          style={styles.header}
          color={'secondary'}
        >
          {header}
        </ThemeText>
        {content.map((c) => (
          <InfoChip
            text={c}
            key={c}
            style={styles.infoChip}
            interactiveColor={themeColor}
          />
        ))}
      </View>
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  header: {
    marginTop: theme.spacings.small,
  },
  container: {
    flexDirection: 'row',
    marginVertical: theme.spacings.xSmall,
  },
  infoChip: {
    marginTop: theme.spacings.small,
  },
}));

export default FareContractDetail;
