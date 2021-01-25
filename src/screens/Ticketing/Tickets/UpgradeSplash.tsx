import React from 'react';
import {View, useWindowDimensions} from 'react-native';

import {ShinyTicketBanner} from '../../../assets/svg/illustrations';
import {StyleSheet} from '../../../theme';

import ThemeText from '../../../components/text';

import {useTranslation, UpgradeSplashTexts} from '../../../translations';
import MessageBox from '../../../message-box';

export default function UpgradeSplash() {
  const styles = useStyles();
  const {width: windowWidth} = useWindowDimensions();

  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.bannerContainer}>
        <ShinyTicketBanner
          width={windowWidth}
          height={windowWidth / 2}
        ></ShinyTicketBanner>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.textContent}>
          <ThemeText style={[styles.text, styles.bold]}>
            {t(UpgradeSplashTexts.title)}
          </ThemeText>
          <MessageBox
            type="warning"
            message={t(UpgradeSplashTexts.paragraph1)}
          />
        </View>
      </View>
    </View>
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
