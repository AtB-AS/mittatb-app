import React from 'react';
import {UserCountState} from './use-user-count-state';
import {
  useTranslation,
  TicketTravellerTexts,
  PurchaseOverviewTexts,
  getTextForLanguage,
} from '@atb/translations';
import {getReferenceDataName} from '@atb/reference-data/utils';
import {usePreferences} from '@atb/preferences';
import {RadioGroupSection, Section} from '@atb/components/sections';
import {UserProfileWithCount} from '@atb/fare-contracts';

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

  function travellerInfoByFareProductType(
    fareProductType: string | undefined,
    u: UserProfileWithCount,
  ) {
    const genericUserProfileDescription = getTextForLanguage(
      u.alternativeDescriptions,
      language,
    );

    return [
      t(
        TicketTravellerTexts.userProfileDescriptionOverride(
          u.userTypeString,
          fareProductType,
        ),
      ) || genericUserProfileDescription,
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
        itemToSubtext={(u) =>
          travellerInfoByFareProductType(fareProductType, u)
        }
        selected={selectedProfile}
        onSelect={select}
        color="interactive_2"
        accessibilityHint={t(PurchaseOverviewTexts.travellerSelection.a11yHint)}
      />
    </Section>
  );
}
