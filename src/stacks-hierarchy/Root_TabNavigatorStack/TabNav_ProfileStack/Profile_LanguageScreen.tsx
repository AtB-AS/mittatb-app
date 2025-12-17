import {
  RadioGroupSection,
  Section,
  ToggleSectionItem,
} from '@atb/components/sections';
import {
  Preference_Language,
  usePreferencesContext,
} from '@atb/modules/preferences';
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
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {ProfileScreenProps} from './navigation-types';

const identity = (s: string) => s;

type Props = ProfileScreenProps<'Profile_LanguageScreen'>;

export const Profile_LanguageScreen = ({navigation}: Props) => {
  const {
    setPreference,
    preferences: {useSystemLanguage = true, language},
  } = usePreferencesContext();

  const style = useStyle();
  const {t} = useTranslation();
  const {isNynorskEnabled} = useFeatureTogglesContext();

  const languages = Array.from(appLanguages);

  const languagesExceptNynorsk = languages.filter((lang) => lang !== 'nn');

  const selectableLanguages = isNynorskEnabled
    ? languages
    : languagesExceptNynorsk;

  const focusRef = useFocusOnLoad(navigation);

  return (
    <FullScreenView
      focusRef={focusRef}
      headerProps={{
        title: t(LanguageSettingsTexts.header.title),
        leftButton: {type: 'back'},
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
