import Button from '@atb/components/button';
import ThemeText from '@atb/components/text';
import {usePreferences} from '@atb/preferences';
import React, {useState} from 'react';
import analytics from '@react-native-firebase/analytics';
import {TouchableOpacity, View} from 'react-native';
import {updateMetadata} from '@atb/chat/metadata';
import {StyleSheet, Theme} from '@atb/theme';

type PromptType = {
  variant: 'halfWidth' | 'fullWidth';
};

const Prompt = ({variant}: PromptType) => {
  const [hidden, setHidden] = useState<boolean>(false);
  const {
    setPreference,
    preferences: {useExperimentalTripSearch, newDepartures},
  } = usePreferences();
  const styles = usePromptStyle();

  if (hidden) return null;

  return (
    <View
      style={[styles.container, variant === 'halfWidth' && styles.halfWidth]}
    >
      <ThemeText>Nytt reisesøk!</ThemeText>
      <ThemeText>
        Har du lyst til å prøve en ny versjon av reisesøket?
      </ThemeText>
      <Button
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
      <TouchableOpacity onPress={() => setHidden(true)}>
        <ThemeText>Nei takk</ThemeText>
      </TouchableOpacity>
    </View>
  );
};

const usePromptStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    borderRadius: theme.border.radius.regular,
    backgroundColor: theme.colors.background_1.backgroundColor,
    marginBottom: theme.spacings.xLarge,
    padding: theme.spacings.medium,
  },
  halfWidth: {
    width: '70%',
  },
  buttons: {},
}));

export default Prompt;
