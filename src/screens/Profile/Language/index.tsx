import ScreenHeader from '@atb/components/screen-header';
import {ActionItem, RadioSection, Section} from '@atb/components/sections';
import {Preference_Language, usePreferences} from '@atb/preferences';
import {StyleSheet, Theme} from '@atb/theme';
import {
  appLanguages,
  DEFAULT_LANGUAGE,
  LanguageSettingsTexts,
  useTranslation,
} from '@atb/translations';
import React from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
const identity = (s: string) => s;
export default function Language() {
  const {
    setPreference,
    preferences: {useSystemLanguage = true, language},
  } = usePreferences();

  const style = useStyle();
  const {t} = useTranslation();

  const languages = Array.from(appLanguages);

  return (
    <SafeAreaView style={style.container}>
      <ScreenHeader
        title={t(LanguageSettingsTexts.header.title)}
        leftButton={{type: 'back'}}
      />
      <ScrollView>
        <Section withPadding withTopPadding>
          <ActionItem
            mode="toggle"
            text={t(LanguageSettingsTexts.usePhoneSettings)}
            checked={useSystemLanguage}
            onPress={(checked) => setPreference({useSystemLanguage: checked})}
          />
        </Section>
        {!useSystemLanguage && (
          <RadioSection<Preference_Language>
            withPadding
            items={languages}
            keyExtractor={identity}
            itemToText={(item) => {
              return t(LanguageSettingsTexts.options[item]);
            }}
            selected={language ?? languages.find((l) => l == DEFAULT_LANGUAGE)}
            onSelect={(language) => setPreference({language})}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const useStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.background.level1,
    flex: 1,
  },
}));
