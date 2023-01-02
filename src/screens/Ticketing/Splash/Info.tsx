import {TicketSplash} from '@atb/assets/svg/color/images';
import {ScreenHeader} from '@atb/components/screen-header';
import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {StaticColor} from '@atb/theme/colors';
import {TicketingSplashTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {useWindowDimensions, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function SplashInfo() {
  const styles = useStyles();
  const {width: windowWidth} = useWindowDimensions();
  const {t} = useTranslation();

  const bgcolor: StaticColor = 'background_accent_0';

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title={t(TicketingSplashTexts.header.title)}
        rightButton={{type: 'chat'}}
        color={bgcolor}
      />
      <View style={styles.bannerContainer}>
        <TicketSplash width={windowWidth} height={windowWidth / 2} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.contentContainer}>
          <View style={styles.textContent}>
            <ThemeText
              type="body__primary--jumbo--bold"
              color={bgcolor}
              style={styles.text}
            >
              {t(TicketingSplashTexts.splash.title)}
            </ThemeText>
            <ThemeText color={bgcolor} style={styles.text}>
              {t(TicketingSplashTexts.splash.paragraph1)}
            </ThemeText>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.static.background.background_accent_0.background,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    paddingVertical: theme.spacings.xLarge,
    flex: 1,
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContent: {
    paddingHorizontal: theme.spacings.large,
    marginBottom: theme.spacings.xLarge,
    boxShadow: 'inset 0',
  },
  buttonContainer: {
    paddingHorizontal: theme.spacings.large,
    width: '100%',
    marginBottom: theme.spacings.medium,
  },
  text: {
    marginBottom: theme.spacings.large,
  },
  bannerContainer: {
    position: 'absolute',
    bottom: theme.spacings.large,
  },
  underline: {textDecorationLine: 'underline'},
  button: {marginBottom: theme.spacings.small},
}));
