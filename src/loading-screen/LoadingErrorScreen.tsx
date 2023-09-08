import React from 'react';
import {Linking, ScrollView, View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {
  dictionary,
  LoadingScreenTexts,
  useTranslation,
} from '@atb/translations';
import {Button} from '@atb/components/button';
import {useAuthState} from '@atb/auth';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {useLocalConfig} from '@atb/utils/use-local-config';
import {ExternalLink} from '@atb/assets/svg/mono-icons/navigation';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {SafeAreaView} from 'react-native-safe-area-context';

const themeColor = 'background_accent_0';
export const LoadingErrorScreen = React.memo(() => {
  const styles = useStyles();
  const localConfig = useLocalConfig();
  const {retryAuth} = useAuthState();
  const {t} = useTranslation();
  const focusRef = useFocusOnLoad();
  const {customer_service_url} = useRemoteConfig();
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View>
          <View ref={focusRef} accessible={true}>
            <ThemeText
              type="heading--jumbo"
              style={styles.header}
              color={themeColor}
            >
              {t(LoadingScreenTexts.error.heading)}
            </ThemeText>
          </View>
          <ThemeText color={themeColor} style={styles.description}>
            {t(LoadingScreenTexts.error.description)}
          </ThemeText>
          {localConfig && (
            <ThemeText
              color={themeColor}
              type="body__secondary"
              accessibilityLabel={t(
                LoadingScreenTexts.error.installId(
                  localConfig.installId.split('').join(' '),
                ),
              )}
            >
              {t(LoadingScreenTexts.error.installId(localConfig.installId))}
            </ThemeText>
          )}
        </View>
        <View>
          <Button
            text={t(dictionary.retry)}
            onPress={retryAuth}
            testID="retryAuthButton"
          />
          <Button
            style={styles.customerServiceButton}
            onPress={() => Linking.openURL(customer_service_url)}
            mode="secondary"
            text={t(LoadingScreenTexts.error.contactButton.text)}
            accessibilityLabel={t(
              LoadingScreenTexts.error.contactButton.a11yLabel,
            )}
            rightIcon={{svg: ExternalLink}}
            interactiveColor="interactive_0"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
});

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.static.background[themeColor].background,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'space-between',
    padding: theme.spacings.xLarge,
  },
  header: {
    marginTop: theme.spacings.xLarge,
    textAlign: 'center',
  },
  description: {marginTop: theme.spacings.medium},
  customerServiceButton: {marginTop: theme.spacings.medium},
}));
