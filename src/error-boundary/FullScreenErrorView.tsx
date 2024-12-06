import {Crash} from '@atb/assets/svg/color/images';
import {Button} from '@atb/components/button';
import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {useLocalConfig} from '@atb/utils/use-local-config';
import React from 'react';
import {View} from 'react-native';
import {getBuildNumber} from 'react-native-device-info';
import {SafeAreaView} from 'react-native-safe-area-context';

type ErrorProps = {
  onRestartApp: () => void;
  errorCode?: string;
};

export function FullScreenErrorView({onRestartApp, errorCode}: ErrorProps) {
  const styles = useStyles();
  const buildNumber = getBuildNumber();
  const config = useLocalConfig();

  return (
    <SafeAreaView style={styles.safearea}>
      <View style={styles.svgContainer}>
        <Crash width="100%" height="100%" />
      </View>
      <View style={styles.container}>
        <View>
          <ThemeText typography="body__primary--bold" style={styles.title}>
            Appen krasja - håper du lander mykt!
          </ThemeText>
          <ThemeText style={styles.message}>
            Appen er i læringsmodus, og slike krasj er akkurat det vi trenger
            for å gjøre den enda mer robust.
            {'\n'}
            Bruk gjerne chat-funksjonen vår til å fortelle oss hva som gikk
            galt.
            {'\n'}
            {'\n'}
            Tusen takk for at du gjør oss bedre!
          </ThemeText>
          <Button
            text="Start appen på nytt"
            onPress={onRestartApp}
            style={styles.button}
          />
        </View>
        <View style={{alignItems: 'center'}}>
          {errorCode && <ThemeText>Feilkode: {errorCode}</ThemeText>}
          <ThemeText>Build-id: {buildNumber}</ThemeText>
          {config?.installId && <ThemeText>Id: {config.installId}</ThemeText>}
        </View>
      </View>
    </SafeAreaView>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  safearea: {
    flex: 1,
    backgroundColor: theme.color.background.neutral[2].background,
  },
  svgContainer: {
    aspectRatio: 1,
    marginHorizontal: 80,
  },
  container: {
    flex: 1,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },
  title: {
    textAlign: 'center',
  },
  message: {
    marginTop: 12,
    textAlign: 'center',
  },
  button: {
    marginVertical: 24,
  },
}));
