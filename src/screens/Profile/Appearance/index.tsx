import {ActionItem, Section} from '@atb/components/sections';
import {StyleSheet, Theme, useTheme} from '@atb/theme';
import {AppearanceSettingsTexts, useTranslation} from '@atb/translations';
import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import {View} from 'react-native';

export default function Appearance() {
  const {
    storedColorScheme,
    overrideColorScheme,
    updateThemePreference,
    overrideOSThemePreference,
  } = useTheme();
  const style = useProfileHomeStyle();
  const {t} = useTranslation();

  return (
    <View style={style.container}>
      <FullScreenHeader
        title={t(AppearanceSettingsTexts.header.title)}
        leftButton={{type: 'back'}}
      />

      <ScrollView>
        <Section withTopPadding withPadding>
          <ActionItem
            mode="toggle"
            text={t(AppearanceSettingsTexts.actions.usePhoneSettings)}
            checked={!overrideColorScheme}
            onPress={(checked) => overrideOSThemePreference(!checked)}
          />

          {overrideColorScheme && (
            <ActionItem
              mode="toggle"
              text={t(AppearanceSettingsTexts.actions.darkMode)}
              checked={storedColorScheme === 'dark'}
              onPress={(checked) =>
                updateThemePreference(checked ? 'dark' : 'light')
              }
            />
          )}
        </Section>
      </ScrollView>
    </View>
  );
}

const useProfileHomeStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.colors.background_1.backgroundColor,
    flex: 1,
  },
}));
