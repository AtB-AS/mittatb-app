import React from 'react';
import {
  getTextForLanguage,
  PurchaseOverviewTexts,
  useTranslation,
} from '@atb/translations';
import {getReferenceDataName} from '@atb/modules/configuration';
import {RadioGroupSection} from '@atb/components/sections';
import {UserProfileWithCount} from '@atb/modules/fare-contracts';
import type {UserCountState} from './types';

export function SingleTravellerSelection({
  userProfilesWithCount,
  increment,
  decrement,
}: UserCountState) {
  const {t, language} = useTranslation();
  const selectedProfile = userProfilesWithCount.find((u) => u.count);

  const select = (u: UserProfileWithCount) => {
    if (selectedProfile) {
      decrement(selectedProfile.userTypeString);
    }
    increment(u.userTypeString);
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
      accessibilityHint={t(PurchaseOverviewTexts.travellerSelection.a11yHint)}
    />
  );
}
