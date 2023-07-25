import {
  RadioGroupSection,
  Section,
  ToggleSectionItem,
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
import {APP_ORG, IS_QA_ENV} from '@env';
import {useTicketingState} from '@atb/ticketing';

const identity = (s: string) => s;
export const Profile_LanguageScreen = () => {
  const {
    setPreference,
    preferences: {useSystemLanguage = true, language},
  } = usePreferences();

  const style = useStyle();
  const {t} = useTranslation();
  const {customerProfile} = useTicketingState();

  const languages = Array.from(appLanguages);

  const isDebug =
    !!JSON.parse(IS_QA_ENV || 'false') || __DEV__ || customerProfile?.debug;

  const languagesExceptNynorsk = languages.filter((lang) => lang !== 'nn');

  const selectableLanguages =
    APP_ORG === 'fram'
      ? languages
      : isDebug
      ? languages
      : languagesExceptNynorsk;

  return (
    <View style={style.container}>
      <FullScreenHeader
        title={t(LanguageSettingsTexts.header.title)}
        leftButton={{type: 'back'}}
      />
      <ScrollView>
        <Section withPadding withTopPadding>
          <ToggleSectionItem
            text={t(LanguageSettingsTexts.usePhoneSettings)}
            value={useSystemLanguage}
            onValueChange={(checked) => {
              setPreference({
                useSystemLanguage: checked,
                language: language || DEFAULT_LANGUAGE,
              });
            }}
            testID="toggleLanguage"
          />
        </Section>
        {!useSystemLanguage && (
          <RadioGroupSection<Preference_Language>
            withPadding
            items={selectableLanguages}
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
};

const useStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.static.background.background_1.background,
    flex: 1,
  },
}));
