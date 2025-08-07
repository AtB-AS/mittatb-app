import {TicketSplash} from '@atb/assets/svg/color/images';
import {ScreenHeader} from '@atb/components/screen-header';
import {ThemeText} from '@atb/components/text';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {TicketingSplashTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {useWindowDimensions, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';

export const Ticketing_NotEnabledScreen = () => {
  const styles = useStyles();
  const {width: windowWidth} = useWindowDimensions();
  const {t} = useTranslation();
  const {theme} = useThemeContext();

  const bgColor = theme.color.background.accent[0];

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title={t(TicketingSplashTexts.header.title)}
        color={bgColor}
      />
      <View style={styles.bannerContainer}>
        <TicketSplash width={windowWidth} height={windowWidth / 2} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.contentContainer}>
          <View style={styles.textContent}>
            <ThemeText
              typography="body__primary--jumbo--bold"
              color={bgColor}
              style={styles.text}
            >
              {t(TicketingSplashTexts.splash.title)}
            </ThemeText>
            <ThemeText color={bgColor} style={styles.text}>
              {t(TicketingSplashTexts.splash.paragraph1)}
            </ThemeText>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.color.background.accent[0].background,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    paddingVertical: theme.spacing.xLarge,
    flex: 1,
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContent: {
    paddingHorizontal: theme.spacing.large,
    marginBottom: theme.spacing.xLarge,
    boxShadow: 'inset 0',
  },
  buttonContainer: {
    paddingHorizontal: theme.spacing.large,
    width: '100%',
    marginBottom: theme.spacing.medium,
  },
  text: {
    marginBottom: theme.spacing.large,
  },
  bannerContainer: {
    position: 'absolute',
    bottom: theme.spacing.large,
  },
  underline: {textDecorationLine: 'underline'},
  button: {marginBottom: theme.spacing.small},
}));
