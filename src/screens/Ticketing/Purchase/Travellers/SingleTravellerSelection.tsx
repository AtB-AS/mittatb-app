import React from 'react';
import {UserCountState, UserProfileWithCount} from './use-user-count-state';
import {useTranslation} from '@atb/translations';
import * as Sections from '../../../../components/sections';
import {getReferenceDataName} from '@atb/reference-data/utils';

export default function SingleTravellerSelection({
  userProfilesWithCount,
  addCount,
  removeCount,
}: UserCountState) {
  const {language} = useTranslation();
  const selectedProfile = userProfilesWithCount.find((u) => u.count);

  const select = (u: UserProfileWithCount) => {
    if (selectedProfile) {
      removeCount(selectedProfile.userTypeString);
    }
    addCount(u.userTypeString);
  };

  return (
    <Sections.Section>
      <Sections.RadioSection<UserProfileWithCount>
        items={userProfilesWithCount}
        keyExtractor={(u) => u.userTypeString}
        itemToText={(u) => getReferenceDataName(u, language)}
        // @TODO: add translated descriptions
        // itemToSubtext={(u: UserProfileWithCount) => u.description.value}
        selected={selectedProfile}
        onSelect={select}
        color="interactive_2"
      />
    </Sections.Section>
  );
}
