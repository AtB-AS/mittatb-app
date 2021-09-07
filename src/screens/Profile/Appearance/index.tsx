import {ActionItem, Section} from '@atb/components/sections';
import {StyleSheet, Theme, useTheme} from '@atb/theme';
import {AppearanceSettingsTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import {Platform, View} from 'react-native';

export default function Appearance() {
  const {
    storedColorScheme,
    overrideSystemAppearance,
    updateThemePreference,
    overrideOSThemePreference,
    useAndroidSystemFont,
    updateFontOverride,
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
            text={t(AppearanceSettingsTexts.actions.usePhoneTheme)}
            checked={!overrideSystemAppearance}
            onPress={(checked) => overrideOSThemePreference(!checked)}
          />

          {overrideSystemAppearance && (
            <>
              <ActionItem
                mode="toggle"
                text={t(AppearanceSettingsTexts.actions.darkMode)}
                checked={storedColorScheme === 'dark'}
                onPress={(checked) =>
                  updateThemePreference(checked ? 'dark' : 'light')
                }
              />
            </>
          )}
        </Section>
        {Platform.OS === 'android' && (
          <Section withTopPadding withPadding>
            <ActionItem
              mode="toggle"
              text={t(AppearanceSettingsTexts.actions.useSystemFont)}
              checked={useAndroidSystemFont}
              onPress={(checked) => updateFontOverride(checked)}
            />
          </Section>
        )}
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
