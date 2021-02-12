import React from 'react';
import ScreenHeader from '../components/screen-header';
import {View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {getBuildNumber} from 'react-native-device-info';

import useChatIcon from '../chat/use-chat-icon';
import {CrashParachute} from '../assets/svg/illustrations';
import Button from '../components/button';
import useLocalConfig from '../utils/use-local-config';
import ThemeText from '../components/text';
import {StyleSheet} from '../theme';

type ErrorProps = {
  onRestartApp: () => void;
  errorCode?: string;
};

const ErrorView: React.FC<ErrorProps> = ({onRestartApp, errorCode}) => {
  const styles = useStyles();
  const buildNumber = getBuildNumber();
  const config = useLocalConfig();

  return (
    <SafeAreaView style={styles.safearea}>
      <ScreenHeader title="" />
      <View style={styles.svgContainer}>
        <CrashParachute width="100%" height="100%" />
      </View>
      <View style={styles.container}>
        <View>
          <ThemeText type="paragraphHeadline" style={styles.title}>
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
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  safearea: {
    flex: 1,
    backgroundColor: theme.background.level2,
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

export default ErrorView;
