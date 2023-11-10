import React from 'react';
import {UserCountState} from './use-user-count-state';
import {
  useTranslation,
  TicketTravellerTexts,
  PurchaseOverviewTexts,
  getTextForLanguage,
} from '@atb/translations';
import {getReferenceDataName} from '@atb/configuration';
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
