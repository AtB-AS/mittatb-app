import {Button} from '@atb/components/button';
import {ThemeText} from '@atb/components/text';
import {StyleSheet, themes} from '@atb/theme';
import {ThemedCrashSmall} from '@atb/theme/ThemedAssets';
import React from 'react';
import {Linking, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {CUSTOMER_SERVICE_URL} from '@env';
import {ExternalLink} from '@atb/assets/svg/mono-icons/navigation';

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
        <ThemeText typography="body__m__strong" style={styles.title}>
          Teknisk trøbbel!
        </ThemeText>
        <ThemeText style={styles.message}>
          Noe gikk galt, og appen svarer ikke. Start på nytt, eller gå til våre
          nettsider for hjelp.
        </ThemeText>
      </View>
      <View style={styles.container}>
        <Button
          expanded={true}
          text="Start på nytt"
          onPress={onRestartApp}
          style={styles.button}
        />
        <Button
          mode="secondary"
          backgroundColor={themes['light'].color.background.neutral[2]}
          expanded={true}
          text={getContactButtonText(CUSTOMER_SERVICE_URL)}
          rightIcon={{svg: ExternalLink}}
          onPress={() => Linking.openURL(CUSTOMER_SERVICE_URL)}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

const getContactButtonText = (url: string) => {
  try {
    const urlObj = new URL(url);
    let hostname = urlObj.hostname;
    hostname = hostname.replace(/^www\./i, '');
    return hostname;
  } catch {
    return 'Kontakt oss';
  }
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  safearea: {
    flex: 1,
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
    padding: theme.spacing.xLarge,
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
