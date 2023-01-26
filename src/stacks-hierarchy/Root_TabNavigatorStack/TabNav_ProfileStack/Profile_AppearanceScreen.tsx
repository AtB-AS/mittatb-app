import {Section, ToggleSectionItem} from '@atb/components/sections';
import {StyleSheet, Theme, useTheme} from '@atb/theme';
import {AppearanceSettingsTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {FullScreenHeader} from '@atb/components/screen-header';
import {Platform, View} from 'react-native';

export const Profile_AppearanceScreen = () => {
  const {
    storedColorScheme,
    overrideSystemAppearance,
    updateThemePreference,
    overrideOSThemePreference,
    useAndroidSystemFont,
    updateAndroidFontOverride,
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
          <ToggleSectionItem
            text={t(AppearanceSettingsTexts.actions.usePhoneTheme)}
            value={!overrideSystemAppearance}
            onValueChange={(checked) => overrideOSThemePreference(!checked)}
          />

          {overrideSystemAppearance && (
            <ToggleSectionItem
              text={t(AppearanceSettingsTexts.actions.darkMode)}
              value={storedColorScheme === 'dark'}
              onValueChange={(checked) =>
                updateThemePreference(checked ? 'dark' : 'light')
              }
            />
          )}
        </Section>
        {Platform.OS === 'android' && (
          <Section withTopPadding withPadding>
            <ToggleSectionItem
              text={t(AppearanceSettingsTexts.actions.useSystemFont)}
              value={useAndroidSystemFont}
              onValueChange={(checked) => updateAndroidFontOverride(checked)}
            />
          </Section>
        )}
      </ScrollView>
    </View>
  );
};

const useProfileHomeStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.static.background.background_1.background,
    flex: 1,
  },
}));
