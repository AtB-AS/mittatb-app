import Button from '@atb/components/button';
import ThemeText from '@atb/components/text';
import {usePreferences} from '@atb/preferences';
import React, {useState} from 'react';
import analytics from '@react-native-firebase/analytics';
import {TouchableOpacity, View} from 'react-native';
import {updateMetadata} from '@atb/chat/metadata';
import {StyleSheet, Theme} from '@atb/theme';

type PromptType = {};

const Prompt = ({}: PromptType) => {
  const [hidden, setHidden] = useState<boolean>(false);
  const {
    setPreference,
    preferences: {useExperimentalTripSearch},
  } = usePreferences();
  const styles = usePromptStyle();

  if (hidden) return null;

  return (
    <View style={styles.container}>
      <ThemeText type="heading__title" style={styles.title}>
        Nytt reisesøk!
      </ThemeText>

      <ThemeText style={styles.marginBottom}>
        Har du lyst til å prøve en ny versjon av reisesøket?
      </ThemeText>

      <View style={styles.buttonRow}>
        <Button
          type="inline"
          text="Skru på!"
          onPress={() => {
            analytics().logEvent('toggle_beta_tripsearch', {
              toggle: 'enable',
            });
            updateMetadata({
              'AtB-Beta-TripSearch': 'enabled',
            });
            setPreference({useExperimentalTripSearch});
          }}
        />
        <TouchableOpacity
          onPress={() => setHidden(true)}
          style={styles.noThanks}
        >
          <ThemeText>Nei takk</ThemeText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const usePromptStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    borderRadius: theme.border.radius.regular,
    backgroundColor: theme.colors.background_1.backgroundColor,
    marginBottom: theme.spacings.xLarge,
    padding: theme.spacings.xLarge,
    width: '65%',
  },
  title: {
    marginBottom: theme.spacings.medium,
  },
  buttonRow: {
    marginTop: theme.spacings.xLarge,
    alignSelf: 'flex-start',
    flexDirection: 'row',
  },
  noThanks: {
    justifyContent: 'center',
    marginLeft: theme.spacings.large,
  },
}));

export default Prompt;
