import {
  ActionSectionItem,
  RadioGroupSection,
  Section,
} from '@atb/components/sections';
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
import {FullScreenHeader} from '@atb/components/screen-header';
import {View} from 'react-native';

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
    <View style={style.container}>
      <FullScreenHeader
        title={t(LanguageSettingsTexts.header.title)}
        leftButton={{type: 'back'}}
      />
      <ScrollView>
        <Section withPadding withTopPadding>
          <ActionSectionItem
            mode="toggle"
            text={t(LanguageSettingsTexts.usePhoneSettings)}
            checked={useSystemLanguage}
            onPress={(checked) => {
              setPreference({
                useSystemLanguage: checked,
                language: language || DEFAULT_LANGUAGE,
              });
            }}
          />
        </Section>
        {!useSystemLanguage && (
          <RadioGroupSection<Preference_Language>
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
    </View>
  );
}

const useStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.static.background.background_1.background,
    flex: 1,
  },
}));
