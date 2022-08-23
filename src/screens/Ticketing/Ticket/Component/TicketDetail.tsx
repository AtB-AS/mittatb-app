import {View} from 'react-native';
import ThemeText from '@atb/components/text';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import {StaticColorByType} from '@atb/theme/colors';
const themeColor: StaticColorByType<'background'> = 'background_accent_2';

function TicketDetail({header, children}: {header: string; children: any}) {
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
        {children.map((c: any) => (
          <View style={styles.children} key={c}>
            <ThemeText type="body__tertiary" color={themeColor}>
              {c}
            </ThemeText>
          </View>
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
  children: {
    backgroundColor: theme.static.background.background_accent_2.background,
    borderRadius: theme.spacings.small,
    paddingHorizontal: theme.spacings.small,
    paddingVertical: theme.spacings.xSmall,
    marginTop: theme.spacings.small,
  },
}));

export default TicketDetail;
