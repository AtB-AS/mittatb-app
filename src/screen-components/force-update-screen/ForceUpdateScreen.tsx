import {ThemeText} from '@atb/components/text';
import {Button} from '@atb/components/button';
import {Logo} from '@atb/assets/svg/mono-icons/logo';
import {Linking, Platform, ScrollView, View} from 'react-native';
import React, {useState} from 'react';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {StyleSheet, Theme, useThemeContext} from '@atb/theme';
import {
  ForceUpdateTexts,
  getTextForLanguage,
  useTranslation,
} from '@atb/translations';
import {ExternalLink} from '@atb/assets/svg/mono-icons/navigation';
import Bugsnag from '@bugsnag/react-native';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';

const getThemeColor = (theme: Theme) => theme.color.background.accent[0];

export const ForceUpdateScreen = () => {
  const [error, setError] = useState<boolean>(false);
  const styles = useStyles();
  const {theme} = useThemeContext();
  const themeColor = getThemeColor(theme);
  const {t, language} = useTranslation();
  const {configurableLinks} = useFirestoreConfigurationContext();

  const iconDimension = 80;

  return (
    <View style={styles.container}>
      <View style={styles.mainView}>
        <ScrollView>
          <View style={styles.icon}>
            <Logo
              width={iconDimension}
              height={iconDimension}
              fill={themeColor.foreground.primary}
            />
          </View>
          <ThemeText
            typography="heading__xl"
            style={styles.title}
            color={themeColor}
          >
            {t(ForceUpdateTexts.header)}
          </ThemeText>
          <ThemeText style={styles.subText} color={themeColor}>
            {t(ForceUpdateTexts.subText)}
          </ThemeText>
          <Button
            expanded={true}
            rightIcon={{svg: ExternalLink}}
            onPress={() => {
              const link = Platform.select({
                ios: getTextForLanguage(
                  configurableLinks?.iosStoreListing,
                  language,
                ),
                android: getTextForLanguage(
                  configurableLinks?.androidStoreListing,
                  language,
                ),
                default: '',
              });
              setError(false);
              Linking.canOpenURL(link).then(
                (supported) => {
                  supported && Linking.openURL(link);
                },
                (err) => {
                  Bugsnag.notify(err);
                  setError(true);
                },
              );
            }}
            text={t(ForceUpdateTexts.externalButton)}
          />
          {error && (
            <MessageInfoBox
              message={t(ForceUpdateTexts.errorMessage)}
              type="error"
              style={styles.messageBox}
            />
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: getThemeColor(theme).background,
    flex: 1,
  },
  mainView: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: theme.spacing.medium,
  },
  icon: {
    alignItems: 'center',
  },
  subText: {
    textAlign: 'center',
    paddingBottom: theme.spacing.medium,
  },
  title: {
    textAlign: 'center',
    marginVertical: theme.spacing.medium,
  },
  messageBox: {
    marginVertical: theme.spacing.medium,
  },
}));
