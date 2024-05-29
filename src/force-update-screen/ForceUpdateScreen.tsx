import {ThemeText} from '@atb/components/text';
import {Button} from '@atb/components/button';
import {Logo} from '@atb/assets/svg/mono-icons/logo';
import {Linking, Platform, ScrollView, View} from 'react-native';
import React, {useState} from 'react';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {ANDROID_STORE_ID, IOS_STORE_ID} from '@env';
import {StyleSheet, useTheme} from '@atb/theme';
import {StaticColorByType} from '@atb/theme/colors.ts';
import {ForceUpdateTexts, useTranslation} from '@atb/translations';
import {ExternalLink} from '@atb/assets/svg/mono-icons/navigation';
import Bugsnag from '@bugsnag/react-native';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export const ForceUpdateScreen = () => {
  const [error, setError] = useState<boolean>(false);
  const styles = useStyles();
  const {theme} = useTheme();
  const {t} = useTranslation();
  const iconDimension = 80;

  return (
    <View style={styles.container}>
      <View style={styles.mainView}>
        <ScrollView>
          <View style={styles.icon}>
            <Logo
              width={iconDimension}
              height={iconDimension}
              fill={theme.static.background[themeColor].text}
            />
          </View>
          <ThemeText
            type="body__primary--big--bold"
            style={styles.title}
            color={themeColor}
          >
            {t(ForceUpdateTexts.header)}
          </ThemeText>
          <ThemeText style={styles.subText} color={themeColor}>
            {t(ForceUpdateTexts.subText)}
          </ThemeText>
          <Button
            rightIcon={{svg: ExternalLink}}
            onPress={() => {
              const link = Platform.select({
                ios: `itms-apps://apps.apple.com/us/app/${IOS_STORE_ID}`,
                android: `market://details?id=${ANDROID_STORE_ID}`,
                default: '',
              });
              setError(false);
              Linking.canOpenURL(link).then(
                (supported) => {
                  supported && Linking.openURL(link);
                },
                (err) => {
                  Bugsnag.notify(err as any);
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
    backgroundColor: theme.static.background[themeColor].background,
    flex: 1,
  },
  mainView: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: theme.spacings.medium,
  },
  icon: {
    alignItems: 'center',
  },
  subText: {
    textAlign: 'center',
    paddingBottom: theme.spacings.medium,
  },
  title: {
    textAlign: 'center',
    marginVertical: theme.spacings.medium,
  },
  messageBox: {
    marginVertical: theme.spacings.medium,
  },
}));
