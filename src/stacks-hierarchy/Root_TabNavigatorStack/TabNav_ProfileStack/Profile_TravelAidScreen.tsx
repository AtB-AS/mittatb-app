import React from 'react';
import {View} from 'react-native';
import {StyleSheet, Theme} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import {FullScreenView} from '@atb/components/screen-view';
import {ContentHeading, ScreenHeading} from '@atb/components/heading';
import TravelAidSettingsTexts from '@atb/translations/screens/subscreens/TravelAidSettingsTexts';

export const Profile_TravelAidScreen = () => {
  const styles = useStyles();
  const {t} = useTranslation();

  return (
    <FullScreenView
      headerProps={{
        title: t(TravelAidSettingsTexts.header.title),
        leftButton: {type: 'back', withIcon: true},
      }}
      parallaxContent={(focusRef) => (
        <ScreenHeading
          ref={focusRef}
          text={t(TravelAidSettingsTexts.header.title)}
        />
      )}
    >
      <View style={styles.content}>
        <ContentHeading text={t(TravelAidSettingsTexts.header.title)} />
      </View>
    </FullScreenView>
  );
};

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  content: {
    margin: theme.spacings.medium,
    rowGap: theme.spacings.small,
  },
}));
