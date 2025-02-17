import {TicketSplash} from '@atb/assets/svg/color/images';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {StyleSheet} from '@atb/theme';
import {UpgradeSplashTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {useWindowDimensions, View} from 'react-native';

export const UpgradeSplash = () => {
  const styles = useStyles();
  const {width: windowWidth} = useWindowDimensions();

  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.bannerContainer}>
        <TicketSplash width={windowWidth} height={windowWidth / 2} />
      </View>
      <MessageInfoBox
        type="warning"
        title={t(UpgradeSplashTexts.title)}
        message={t(UpgradeSplashTexts.paragraph1)}
      />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.color.background.neutral[1].background,
    padding: theme.spacing.medium,
  },
  bannerContainer: {
    position: 'absolute',
    bottom: theme.spacing.large,
  },
}));
