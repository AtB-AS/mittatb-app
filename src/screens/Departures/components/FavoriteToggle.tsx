import {ActionItem} from '@atb/components/sections';
import {StyleSheet} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import DeparturesTexts from '@atb/translations/screens/Departures';
import React from 'react';
import {View} from 'react-native';

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
    <ActionItem
      transparent
      text={t(DeparturesTexts.favorites.toggle)}
      mode="toggle"
      checked={enabled}
      onPress={setEnabled}
      testID="showOnlyFavoritesButton"
    />
  );
}
