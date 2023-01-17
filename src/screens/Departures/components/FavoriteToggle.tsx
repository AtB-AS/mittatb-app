import {ToggleSectionItem} from '@atb/components/sections';
import {useTranslation} from '@atb/translations';
import DeparturesTexts from '@atb/translations/screens/Departures';
import React from 'react';

type FavoriteToggleProps = {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
};

export default function FavoriteToggle({
  enabled,
  setEnabled,
}: FavoriteToggleProps): JSX.Element {
  const {t} = useTranslation();

  return (
    <ToggleSectionItem
      transparent
      text={t(DeparturesTexts.favorites.toggle)}
      value={enabled}
      onValueChange={setEnabled}
      testID="showOnlyFavoritesButton"
    />
  );
}
