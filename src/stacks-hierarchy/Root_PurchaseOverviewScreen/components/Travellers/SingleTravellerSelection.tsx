import React from 'react';
import {
  getTextForLanguage,
  PurchaseOverviewTexts,
  useTranslation,
} from '@atb/translations';
import {getReferenceDataName} from '@atb/configuration';
import {RadioGroupSection} from '@atb/components/sections';
import {UserProfileWithCount} from '@atb/fare-contracts';
import {useThemeContext} from '@atb/theme';
import type {UserCountState} from './types';

export function SingleTravellerSelection({
  userProfilesWithCount,
  addCount,
  removeCount,
}: UserCountState) {
  const {t, language} = useTranslation();
  const {theme} = useThemeContext();
  const selectedProfile = userProfilesWithCount.find((u) => u.count);

  const select = (u: UserProfileWithCount) => {
    if (selectedProfile) {
      removeCount(selectedProfile.userTypeString);
    }
    addCount(u.userTypeString);
  };

  return (
    <RadioGroupSection<UserProfileWithCount>
      items={userProfilesWithCount}
      keyExtractor={(u) => u.userTypeString}
      itemToText={(u) => getReferenceDataName(u, language)}
      itemToSubtext={(u) =>
        getTextForLanguage(u.alternativeDescriptions, language)
      }
      selected={selectedProfile}
      onSelect={select}
      color={theme.color.interactive[2]}
      accessibilityHint={t(PurchaseOverviewTexts.travellerSelection.a11yHint)}
    />
  );
}
