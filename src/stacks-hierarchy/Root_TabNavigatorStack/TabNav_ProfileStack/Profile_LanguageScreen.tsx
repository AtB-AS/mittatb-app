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

  const languages = Array.from(appLanguages);

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
            items={languages}
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
    margin: theme.spacings.medium,
    rowGap: theme.spacings.small,
  },
}));
