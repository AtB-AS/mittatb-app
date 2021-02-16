import React from 'react';
import {UserCountState} from './use-user-count-state';
import {useTranslation} from '@atb/translations';
import * as Sections from '../../../../components/sections';
import {getReferenceDataName} from '@atb/reference-data/utils';

export default function MultipleTravellersSelection({
  userProfilesWithCount,
  addCount,
  removeCount,
}: UserCountState) {
  const {language} = useTranslation();
  return (
    <Sections.Section>
      {userProfilesWithCount.map((u) => (
        <Sections.CounterInput
          key={u.userTypeString}
          text={getReferenceDataName(u, language)}
          count={u.count}
          addCount={() => addCount(u.userTypeString)}
          removeCount={() => removeCount(u.userTypeString)}
        />
      ))}
    </Sections.Section>
  );
}
