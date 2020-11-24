import React from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ActionItem, Section} from '../../../components/sections';
import {usePreferences} from '../../../preferences';
import {StyleSheet, Theme} from '../../../theme';
import BackHeader from '../BackHeader';

export default function Appearance() {
  const {
    setPreference,
    preferences: {colorScheme, overrideColorScheme},
  } = usePreferences();
  const style = useProfileHomeStyle();

  return (
    <SafeAreaView style={style.container}>
      <BackHeader title="Utseende" />

      <ScrollView>
        <Section withTopPadding withPadding>
          <ActionItem
            mode="toggle"
            text="Bruk telefoninnstillinger"
            checked={!overrideColorScheme}
            onPress={(checked) =>
              setPreference({overrideColorScheme: !checked})
            }
          />

          {overrideColorScheme && (
            <ActionItem
              mode="toggle"
              text="Mørk modus"
              checked={colorScheme === 'dark'}
              onPress={(checked) =>
                setPreference({colorScheme: checked ? 'dark' : 'light'})
              }
            />
          )}
        </Section>
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
