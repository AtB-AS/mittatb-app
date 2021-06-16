import React, {useRef} from 'react';
import {UserCountState} from './use-user-count-state';
import {useTranslation} from '@atb/translations';
import * as Sections from '../../../../components/sections';
import {getReferenceDataName} from '@atb/reference-data/utils';
import {createTravellersText} from '@atb/screens/Ticketing/Purchase/Overview';
import {useScreenReaderAnnouncement} from '@atb/components/screen-reader-announcement';

export default function MultipleTravellersSelection({
  userProfilesWithCount,
  addCount,
  removeCount,
}: UserCountState) {
  const {t, language} = useTranslation();

  const travellersModified = useRef(false);

  const addTraveller = (userTypeString: string) => {
    travellersModified.current = true;
    addCount(userTypeString);
  };

  const removeTraveller = (userTypeString: string) => {
    travellersModified.current = true;
    removeCount(userTypeString);
  };

  useScreenReaderAnnouncement(
    createTravellersText(userProfilesWithCount, false, true, t, language),
    travellersModified.current,
  );

  return (
    <Sections.Section>
      {userProfilesWithCount.map((u) => (
        <Sections.CounterInput
          key={u.userTypeString}
          text={getReferenceDataName(u, language)}
          count={u.count}
          addCount={() => addTraveller(u.userTypeString)}
          removeCount={() => removeTraveller(u.userTypeString)}
          type="spacious"
        />
      ))}
    </Sections.Section>
  );
}
