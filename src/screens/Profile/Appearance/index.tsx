import ScreenHeader from '@atb/components/screen-header';
import {ActionItem, Section} from '@atb/components/sections';
import {StyleSheet, Theme, useTheme} from '@atb/theme';
import {AppearanceSettingsTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';

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
    <SafeAreaView style={style.container}>
      <ScreenHeader
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
    </SafeAreaView>
  );
}

const useProfileHomeStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.background.level1,
    flex: 1,
  },
}));
