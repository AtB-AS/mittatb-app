import React from 'react';
import {Linking, ScrollView, View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {StyleSheet, Theme, useThemeContext} from '@atb/theme';
import {
  dictionary,
  LoadingScreenTexts,
  useTranslation,
} from '@atb/translations';
import {Button} from '@atb/components/button';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {useLocalConfig} from '@atb/utils/use-local-config';
import {ExternalLink} from '@atb/assets/svg/mono-icons/navigation';
import {useRemoteConfigContext} from '@atb/RemoteConfigContext';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {spellOut} from '@atb/utils/accessibility';

const getThemeColor = (theme: Theme) => theme.color.background.accent[0];

export const LoadingErrorScreen = React.memo(({retry}: {retry: () => void}) => {
  const styles = useStyles();
  const localConfig = useLocalConfig();
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const themeColor = getThemeColor(theme);
  const focusRef = useFocusOnLoad();
  const {customer_service_url} = useRemoteConfigContext();
  const analytics = useAnalyticsContext();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View>
          <View ref={focusRef} accessible={true}>
            <ThemeText
              typography="heading--jumbo"
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
              typography="body__secondary"
              accessibilityLabel={t(
                LoadingScreenTexts.error.installId(
                  spellOut(localConfig.installId),
                ),
              )}
            >
              {t(LoadingScreenTexts.error.installId(localConfig.installId))}
            </ThemeText>
          )}
        </View>
        <View>
          <Button
            expanded={true}
            text={t(dictionary.retry)}
            onPress={() => {
              analytics.logEvent(
                'Loading boundary',
                'Retry app loading clicked',
              );
              retry();
            }}
            testID="retryAuthButton"
          />
          <Button
            expanded={true}
            style={styles.customerServiceButton}
            onPress={() => {
              analytics.logEvent(
                'Loading boundary',
                'Contact customer service clicked',
              );
              Linking.openURL(customer_service_url);
            }}
            mode="secondary"
            text={t(LoadingScreenTexts.error.contactButton.text)}
            accessibilityLabel={t(
              LoadingScreenTexts.error.contactButton.a11yLabel,
            )}
            accessibilityRole="link"
            rightIcon={{svg: ExternalLink}}
            backgroundColor={themeColor}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
});

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: getThemeColor(theme).background,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'space-between',
    padding: theme.spacing.xLarge,
  },
  header: {
    marginTop: theme.spacing.xLarge,
    textAlign: 'center',
  },
  description: {marginVertical: theme.spacing.medium},
  customerServiceButton: {marginTop: theme.spacing.medium},
}));
