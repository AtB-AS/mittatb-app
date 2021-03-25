import {ShinyTicketBanner} from '@atb/assets/svg/illustrations';
import Button from '@atb/components/button';
import Header from '@atb/components/screen-header';
import ThemeText from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {TicketSplashTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {useWindowDimensions, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TicketSplashNavigationProp} from './';

type Props = {
  navigation: TicketSplashNavigationProp;
};

export default function SplashInfo({navigation}: Props) {
  const styles = useStyles();
  const {width: windowWidth} = useWindowDimensions();
  const {t} = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={t(TicketSplashTexts.header.title)}
        rightButton={{type: 'chat'}}
        leftButton={{type: 'home'}}
      />
      <View style={styles.bannerContainer}>
        <ShinyTicketBanner
          width={windowWidth}
          height={windowWidth / 2}
        ></ShinyTicketBanner>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.contentContainer}>
          <View style={styles.textContent}>
            <ThemeText style={[styles.text, styles.bold]}>
              {t(TicketSplashTexts.splash.title)}
            </ThemeText>
            <ThemeText style={styles.text}>
              {t(TicketSplashTexts.splash.paragraph1)}
            </ThemeText>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              color="primary_2"
              onPress={() => navigation.navigate('TicketEnrollment')}
              text={t(TicketSplashTexts.splash.betaButtonLabel)}
              style={styles.button}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {flex: 1, backgroundColor: theme.background.accent},
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
    backgroundColor: theme.background.accent,
    marginBottom: theme.spacings.xLarge,
    boxShadow: 'inset 0',
  },
  buttonContainer: {
    paddingHorizontal: theme.spacings.large,
    width: '100%',
    marginBottom: theme.spacings.medium,
  },
  text: {
    textAlign: 'center',
    marginBottom: theme.spacings.large,
  },
  bold: {fontWeight: 'bold'},
  bannerContainer: {
    position: 'absolute',
    bottom: theme.spacings.large,
  },
  underline: {textDecorationLine: 'underline'},
  button: {marginBottom: theme.spacings.small},
}));
