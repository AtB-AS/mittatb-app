import {RadioGroupSection} from '@atb/components/sections';
import {
  Preference_ScreenAlternatives,
  preference_screenAlternatives,
  usePreferencesContext,
} from '@atb/modules/preferences';
import {
  SelectStartScreenTexts,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import React from 'react';
import {FullScreenView} from '@atb/components/screen-view';
import {ScreenHeading} from '@atb/components/heading';
import {StyleSheet} from '@atb/theme';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {ProfileScreenProps} from './navigation-types';

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

type Props = ProfileScreenProps<'Profile_SelectStartScreenScreen'>;

export const Profile_SelectStartScreenScreen = ({navigation}: Props) => {
  const {
    setPreference,
    preferences: {startScreen},
  } = usePreferencesContext();
  const {t} = useTranslation();
  const styles = useStyles();
  const items = Array.from(preference_screenAlternatives);

  const focusRef = useFocusOnLoad(navigation);

  return (
    <FullScreenView
      focusRef={focusRef}
      headerProps={{
        title: t(SelectStartScreenTexts.header.title),
        leftButton: {type: 'back'},
      }}
      parallaxContent={(focusRef) => (
        <ScreenHeading
          ref={focusRef}
          text={t(SelectStartScreenTexts.header.title)}
        />
      )}
    >
      <RadioGroupSection<Preference_ScreenAlternatives>
        style={styles.section}
        items={items}
        keyExtractor={identity}
        itemToText={(alt) => toName(alt, t)}
        selected={startScreen ?? items[0]}
        onSelect={(startScreen) => setPreference({startScreen})}
      />
    </FullScreenView>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  section: {
    marginHorizontal: theme.spacing.medium,
    marginBottom: theme.spacing.small,
    marginTop: theme.spacing.large,
  },
}));
