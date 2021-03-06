import {ShinyTicketBanner} from '@atb/assets/svg/illustrations';
import MessageBox from '@atb/components/message-box';
import {StyleSheet} from '@atb/theme';
import {UpgradeSplashTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {useWindowDimensions, View} from 'react-native';

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
      <MessageBox
        type="warning"
        title={t(UpgradeSplashTexts.title)}
        message={t(UpgradeSplashTexts.paragraph1)}
      />
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background_1.backgroundColor,
    padding: theme.spacings.medium,
  },
  bannerContainer: {
    position: 'absolute',
    bottom: theme.spacings.large,
  },
}));
