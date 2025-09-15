import {ToggleSectionItem} from '@atb/components/sections';
import {DeparturesTexts, useTranslation} from '@atb/translations';
import React from 'react';

type FavoriteToggleProps = {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
};

export function FavoriteToggle({
  enabled,
  setEnabled,
}: FavoriteToggleProps): React.JSX.Element {
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
