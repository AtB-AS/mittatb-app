import {Button} from '@atb/components/button';
import {ThemeText} from '@atb/components/text';
import {StyleSheet, themes} from '@atb/theme';
import {ThemedCrashSmall} from '@atb/theme/ThemedAssets';
import React from 'react';
import {Linking, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {CUSTOMER_SERVICE_URL} from '@env';

type ErrorProps = {
  onRestartApp: () => void;
  errorCode?: string;
};

export function FullScreenErrorView({onRestartApp}: ErrorProps) {
  const styles = useStyles();

  return (
    <SafeAreaView style={styles.safearea}>
      <View style={styles.svgContainer}>
        <ThemedCrashSmall height={200} style={styles.svg} />
        <ThemeText typography="body__primary--bold" style={styles.title}>
          Teknisk Trøbbel
        </ThemeText>
        <ThemeText style={styles.message}>
          Noe gikk galt, og appen svarer ikke. Start på nytt, eller kontakt oss.
        </ThemeText>
      </View>
      <View style={styles.container}>
        <Button
          expanded={true}
          text="Start appen på nytt"
          onPress={onRestartApp}
          style={styles.button}
        />
        <Button
          mode="secondary"
          backgroundColor={themes['light'].color.background.neutral[2]}
          expanded={true}
          text="Kontakt oss"
          onPress={() => Linking.openURL(CUSTOMER_SERVICE_URL)}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  safearea: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: theme.color.background.neutral[2].background,
  },
  svg: {
    margin: theme.spacing.xLarge,
  },
  svgContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.medium,
    marginHorizontal: theme.spacing.medium,
  },
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.xLarge,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    marginTop: theme.spacing.large,
  },
  message: {
    marginTop: theme.spacing.medium,
    textAlign: 'center',
  },
  button: {
    marginVertical: theme.spacing.small,
  },
}));
