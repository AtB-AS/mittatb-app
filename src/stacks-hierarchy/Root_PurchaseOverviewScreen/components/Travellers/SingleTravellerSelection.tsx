import React from 'react';
import {
  getTextForLanguage,
  PurchaseOverviewTexts,
  useTranslation,
} from '@atb/translations';
import {getReferenceDataName, UserProfile} from '@atb/modules/configuration';
import {RadioGroupSection} from '@atb/components/sections';
import {UserProfileWithCount} from '@atb/modules/fare-contracts';
import {UniqueCountState} from '@atb/utils/unique-with-count';

export function SingleTravellerSelection({
  state,
  increment,
  decrement,
}: UniqueCountState<UserProfile>) {
  const {t, language} = useTranslation();
  const selectedProfile = state.find((u) => u.count);

  const select = (u: UserProfileWithCount) => {
    if (selectedProfile) {
      decrement(selectedProfile);
    }
    increment(u);
  };

  return (
    <RadioGroupSection<UserProfileWithCount>
      items={state}
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
