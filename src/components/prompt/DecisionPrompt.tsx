import React, {useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import analytics from '@react-native-firebase/analytics';
import {StyleSheet, Theme} from '@atb/theme';
import {useTranslation, DecisionPromptTexts} from '@atb/translations';
import {usePreferences} from '@atb/preferences';
import {updateMetadata} from '@atb/chat/metadata';
import Button from '@atb/components/button';
import ThemeText from '@atb/components/text';

type DecisionPromptType = {
  variant: 'assistantv2';
};

const DecisionPrompt = ({variant}: DecisionPromptType) => {
  const [hidden, setHidden] = useState<boolean>(false);
  const {
    setPreference,
    preferences: {useExperimentalTripSearch},
  } = usePreferences();
  const styles = usePromptStyle();
  const {t} = useTranslation();

  if (hidden) return null;

  return (
    <View style={styles.container}>
      <ThemeText type="heading__title" style={styles.title}>
        {t(DecisionPromptTexts[variant].title)}
      </ThemeText>

      <ThemeText>{t(DecisionPromptTexts[variant].body)}</ThemeText>

      <View style={styles.buttonRow}>
        <Button
          type="inline"
          text={t(DecisionPromptTexts[variant].buttons.yes)}
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
          <ThemeText>{t(DecisionPromptTexts.assistantv2.buttons.no)}</ThemeText>
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

export default DecisionPrompt;
