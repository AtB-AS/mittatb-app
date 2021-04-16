import ScreenHeader from '@atb/components/screen-header';
import {RadioSection} from '@atb/components/sections';
import {
  Preference_ScreenAlternatives,
  preference_screenAlternatives,
  usePreferences,
} from '@atb/preferences';
import {StyleSheet, Theme} from '@atb/theme';
import {
  SelectStartScreenTexts,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import React from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';

const identity = (s: string) => s;
function toName(
  alt: Preference_ScreenAlternatives,
  t: TranslateFunction,
): string {
  switch (alt) {
    case 'assistant':
      return t(SelectStartScreenTexts.options.assistant);
    case 'departures':
      return t(SelectStartScreenTexts.options.departures);
    case 'ticketing':
      return t(SelectStartScreenTexts.options.ticketing);
  }
}

export default function SelectStartScreen() {
  const {
    setPreference,
    preferences: {startScreen},
  } = usePreferences();
  const style = useProfileHomeStyle();
  const {t} = useTranslation();
  const items = Array.from(preference_screenAlternatives);

  return (
    <SafeAreaView style={style.container}>
      <ScreenHeader
        title={t(SelectStartScreenTexts.header.title)}
        leftButton={{type: 'back'}}
      />

      <ScrollView>
        <RadioSection<Preference_ScreenAlternatives>
          withPadding
          withTopPadding
          items={items}
          keyExtractor={identity}
          itemToText={(alt) => toName(alt, t)}
          selected={startScreen ?? items[0]}
          onSelect={(startScreen) => setPreference({startScreen})}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const useProfileHomeStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.colors.background_1.backgroundColor,
    flex: 1,
  },
}));
