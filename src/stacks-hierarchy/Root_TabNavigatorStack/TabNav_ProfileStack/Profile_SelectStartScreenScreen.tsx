import {RadioGroupSection} from '@atb/components/sections';
import {
  Preference_ScreenAlternatives,
  preference_screenAlternatives,
  usePreferences,
} from '@atb/preferences';
import {
  SelectStartScreenTexts,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import React from 'react';
import {FullScreenView} from '@atb/components/screen-view';
import {ScreenHeading} from '@atb/components/heading';

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

export const Profile_SelectStartScreenScreen = () => {
  const {
    setPreference,
    preferences: {startScreen},
  } = usePreferences();
  const {t} = useTranslation();
  const items = Array.from(preference_screenAlternatives);

  return (
    <FullScreenView
      headerProps={{
        title: t(SelectStartScreenTexts.header.title),
        leftButton: {type: 'back', withIcon: true},
      }}
      parallaxContent={(focusRef) => (
        <ScreenHeading
          ref={focusRef}
          text={t(SelectStartScreenTexts.header.title)}
        />
      )}
    >
      <RadioGroupSection<Preference_ScreenAlternatives>
        withPadding
        withTopPadding
        items={items}
        keyExtractor={identity}
        itemToText={(alt) => toName(alt, t)}
        selected={startScreen ?? items[0]}
        onSelect={(startScreen) => setPreference({startScreen})}
      />
    </FullScreenView>
  );
};
