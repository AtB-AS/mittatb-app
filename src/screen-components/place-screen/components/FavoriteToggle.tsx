import {ToggleSectionItem} from '@atb/components/sections';
import {useAnalyticsContext} from '@atb/modules/analytics';
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
  const analytics = useAnalyticsContext();

  return (
    <ToggleSectionItem
      transparent
      text={t(DeparturesTexts.favorites.toggle)}
      value={enabled}
      onValueChange={(checked) => {
        analytics.logEvent('Departures', 'FavoriteToggle', {enabled: checked});
        setEnabled(checked);
      }}
      testID="showOnlyFavoritesButton"
    />
  );
}
