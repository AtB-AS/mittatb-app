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
  return (
    <Sections.Section>
      <Sections.RadioSection<UserProfileWithCount>
        items={userProfilesWithCount}
        keyExtractor={(u) => u.userTypeString}
        itemToText={(u) => getReferenceDataName(u, language)}
        selected={selectedProfile}
        onSelect={(u) => {
          if (selectedProfile) {
            removeCount(selectedProfile.userTypeString);
          }
          addCount(u.userTypeString);
        }}
        color="interactive_2"
      />
    </Sections.Section>
  );
}
