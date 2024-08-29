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
import {View} from 'react-native';
import {APP_ORG, IS_QA_ENV} from '@env';
import {useTicketingState} from '@atb/ticketing';
import {FullScreenView} from '@atb/components/screen-view';
import {ScreenHeading} from '@atb/components/heading';

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
    <FullScreenView
      headerProps={{
        title: t(LanguageSettingsTexts.header.title),
        leftButton: {type: 'back', withIcon: true},
      }}
      parallaxContent={(focusRef) => (
        <ScreenHeading
          ref={focusRef}
          text={t(LanguageSettingsTexts.header.title)}
        />
      )}
    >
      <View style={style.container}>
        <Section>
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
            items={selectableLanguages}
            keyExtractor={identity}
            itemToText={(item) => {
              return t(LanguageSettingsTexts.options[item]);
            }}
            selected={language ?? languages.find((l) => l == DEFAULT_LANGUAGE)}
            onSelect={(language) => setPreference({language})}
          />
        )}
      </View>
    </FullScreenView>
  );
};

const useStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    margin: theme.spacing.medium,
    rowGap: theme.spacing.small,
  },
}));
