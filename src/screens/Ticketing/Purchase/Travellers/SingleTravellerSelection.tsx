import React from 'react';
import {UserCountState, UserProfileWithCount} from './use-user-count-state';
import {useTranslation, TicketTravellerTexts} from '@atb/translations';
import * as Sections from '../../../../components/sections';
import {getReferenceDataName} from '@atb/reference-data/utils';
import {usePreferences} from '@atb/preferences';
import {PreassignedFareProductType} from '@atb/reference-data/types';

export default function SingleTravellerSelection({
  userProfilesWithCount,
  addCount,
  removeCount,
  ticketType,
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

  function travellerInfoByTicketType(
    ticketType: PreassignedFareProductType | undefined,
  ) {
    return (u: UserProfileWithCount) => {
      return t(TicketTravellerTexts.information(u.userTypeString, ticketType));
    };
  }

  return (
    <Sections.Section>
      <Sections.RadioSection<UserProfileWithCount>
        items={userProfilesWithCount}
        keyExtractor={(u) => u.userTypeString}
        itemToText={(u) => getReferenceDataName(u, language)}
        hideSubtext={hideTravellerDescriptions}
        itemToSubtext={travellerInfoByTicketType(ticketType)}
        selected={selectedProfile}
        onSelect={select}
        color="interactive_2"
        accessibilityHint={t(PurchaseOverviewTexts.travellerSelection.a11yHint)}
      />
    </Sections.Section>
  );
}
