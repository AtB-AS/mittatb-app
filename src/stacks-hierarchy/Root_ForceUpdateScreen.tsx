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
import {FullScreenHeader} from '@atb/components/screen-header';
import {ExternalLink} from '@atb/assets/svg/mono-icons/navigation';
import {ThemeIcon} from '@atb/components/theme-icon';
// type Props = RootStackScreenProps<'Root_ForceUpdateScreen'>;

// can use APP_VERSION from env file for comparison with firestore min value.
// Where to put this versoin check and how to prompt this new page
const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export const Root_ForceUpdateScreen = () => {
  const [error, setError] = useState<boolean>(false);
  const styles = useStyles();
  const {theme} = useTheme();
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <FullScreenHeader
        leftButton={{
          type: 'back',
        }}
        setFocusOnLoad={false}
        color={themeColor}
        title={t(ForceUpdateTexts.header)}
      />
      <View style={styles.mainView}>
        <ScrollView>
          <ThemeIcon
            svg={Logo}
            size="large"
            style={styles.icon}
            fill={theme.static.background.background_accent_0.text}
          />
          <ThemeText
            type="body__primary--big--bold"
            style={styles.title}
            color={themeColor}
          >
            {t(ForceUpdateTexts.header)}
          </ThemeText>
          <ThemeText style={styles.subText}>
            {t(ForceUpdateTexts.subText)}
          </ThemeText>
          <Button
            rightIcon={{svg: ExternalLink}}
            /* can we have the id or full url in the env-file? Or in Firestore? Take backwards compatability into account here. How likely is it that some of those will change / have something breaking? */
            onPress={() => {
              if (Platform.OS === 'android') {
                // const link = 'market://details?id=no.mittatb.store';
                const link = `market://details?id=${ANDROID_STORE_ID}`;

                Linking.canOpenURL(link).then(
                  (supported) => {
                    supported && Linking.openURL(link);
                    setError(false);
                  },
                  (err) => {
                    console.log('android', err);
                    setError(true);
                  },
                );
              } else {
                // const link = 'itms-apps://apps.apple.com/us/app/id1502395251'; //IOS_BUNDLE_INDETIFIER?
                const link = `itms-apps://apps.apple.com/us/app/${IOS_STORE_ID}`;

                Linking.canOpenURL(link).then(
                  (supported) => {
                    supported && Linking.openURL(link);
                    setError(false);
                  },
                  (err) => {
                    console.log('ios', err);
                    setError(true);
                  },
                  // Show some good error message telling the user what to do
                  // Report to Bugsnag the error
                );
              }
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
