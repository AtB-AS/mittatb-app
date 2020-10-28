import React from 'react';
import ScreenHeader from '../ScreenHeader';
import {Text, View, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {getBuildNumber} from 'react-native-device-info';

import useChatIcon from '../chat/use-chat-icon';
import colors from '../theme/colors';
import {CrashParachute} from '../assets/svg/illustrations';
import Button from '../components/button';
import useLocalConfig from '../utils/use-local-config';

type ErrorProps = {
  onRestartApp: () => void;
  errorCode?: string;
};

const ErrorView: React.FC<ErrorProps> = ({onRestartApp, errorCode}) => {
  const chatIcon = useChatIcon();
  const buildNumber = getBuildNumber();
  const config = useLocalConfig();

  return (
    <SafeAreaView style={styles.safearea}>
      <ScreenHeader title="" rightButton={chatIcon} />
      <View style={styles.svgContainer}>
        <CrashParachute width="100%" height="100%" />
      </View>
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>Appen krasja - håper du lander mykt!</Text>
          <Text style={styles.message}>
            Appen er i læringsmodus, og slike krasj er akkurat det vi trenger
            for å gjøre den enda mer robust.
            {'\n'}
            Bruk gjerne chat-funskjonen vår til å fortelle oss hva som gikk
            galt.
            {'\n'}
            {'\n'}
            Tusen takk for at du gjør oss bedre!
          </Text>
          <Button
            text="Start appen på nytt"
            onPress={onRestartApp}
            style={styles.button}
          />
        </View>
        <View style={{alignItems: 'center'}}>
          {errorCode && <Text>Feilkode: {errorCode}</Text>}
          <Text>Build-id: {buildNumber}</Text>
          {config?.installId && <Text>Id: {config.installId}</Text>}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: colors.secondary.gray_Level2,
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
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
  },
  button: {
    marginVertical: 24,
  },
});

export default ErrorView;
