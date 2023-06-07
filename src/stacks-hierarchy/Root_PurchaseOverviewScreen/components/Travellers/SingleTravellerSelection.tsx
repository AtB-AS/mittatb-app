import React from 'react';
import {UserCountState, UserProfileWithCount} from './use-user-count-state';
import {
  useTranslation,
  TicketTravellerTexts,
  PurchaseOverviewTexts,
  getTextForLanguage,
} from '@atb/translations';
import {getReferenceDataName} from '@atb/reference-data/utils';
import {usePreferences} from '@atb/preferences';
import {RadioGroupSection, Section} from '@atb/components/sections';

export function SingleTravellerSelection({
  userProfilesWithCount,
  addCount,
  removeCount,
  fareProductType,
}: UserCountState) {
  const {t, language} = useTranslation();
  const selectedProfile = userProfilesWithCount.find((u) => u.count);
  const {
    preferences: {hideTravellerDescriptions},
  } = usePreferences();

  const select = (u: UserProfileWithCount) => {
    if (selectedProfile) {
      removeCount(selectedProfile.userTypeString);
    }
    addCount(u.userTypeString);
  };

  function travellerInfoByFareProductType(fareProductType: string | undefined) {
    return (u: UserProfileWithCount) =>
      [
        t(TicketTravellerTexts.userProfileDescription(u, fareProductType)) ||
          getTextForLanguage(u.alternativeDescriptions, language),
        t(TicketTravellerTexts.information(u.userTypeString, fareProductType)),
      ].join(' ');
  }

  return (
    <Section>
      <RadioGroupSection<UserProfileWithCount>
        items={userProfilesWithCount}
        keyExtractor={(u) => u.userTypeString}
        itemToText={(u) => getReferenceDataName(u, language)}
        hideSubtext={hideTravellerDescriptions}
        itemToSubtext={travellerInfoByFareProductType(fareProductType)}
        selected={selectedProfile}
        onSelect={select}
        color="interactive_2"
        accessibilityHint={t(PurchaseOverviewTexts.travellerSelection.a11yHint)}
      />
    </Section>
  );
}
