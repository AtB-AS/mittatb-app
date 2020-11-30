import React from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RadioSection} from '../../../components/sections';
import {
  Preference_ScreenAlternatives,
  preference_screenAlternatives,
  usePreferences,
} from '../../../preferences';
import {StyleSheet, Theme} from '../../../theme';
import BackHeader from '../BackHeader';

const identity = (s: string) => s;
function toName(alt: Preference_ScreenAlternatives): string {
  switch (alt) {
    case 'assistant':
      return 'Reiseassistent';
    case 'departures':
      return 'Avganger';
    case 'ticketing':
      return 'Billetter';
  }
}

export default function SelectStartScreen() {
  const {
    setPreference,
    preferences: {startScreen},
  } = usePreferences();
  const style = useProfileHomeStyle();
  const items = Array.from(preference_screenAlternatives);

  return (
    <SafeAreaView style={style.container}>
      <BackHeader title="Velg startside" />

      <ScrollView>
        <RadioSection<Preference_ScreenAlternatives>
          withPadding
          withTopPadding
          items={items}
          keyExtractor={identity}
          itemToText={toName}
          selected={startScreen ?? items[0]}
          onSelect={(startScreen) => setPreference({startScreen})}
        />
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
