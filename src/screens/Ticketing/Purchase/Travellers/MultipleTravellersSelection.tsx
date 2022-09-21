import React, {useRef} from 'react';
import {UserCountState} from './use-user-count-state';
import {useTranslation, TicketTravellerTexts} from '@atb/translations';
import * as Sections from '../../../../components/sections';
import {getReferenceDataName} from '@atb/reference-data/utils';
import {useScreenReaderAnnouncement} from '@atb/components/screen-reader-announcement';
import {usePreferences} from '@atb/preferences';
import {createTravellersText} from '../utils';

export default function MultipleTravellersSelection({
  userProfilesWithCount,
  addCount,
  removeCount,
  ticketType,
}: UserCountState) {
  const {t, language} = useTranslation();
  const {
    preferences: {hideTravellerDescriptions},
  } = usePreferences();

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
      {userProfilesWithCount.map((u, i) => (
        <Sections.CounterInput
          key={u.userTypeString}
          text={getReferenceDataName(u, language)}
          count={u.count}
          addCount={() => addTraveller(u.userTypeString)}
          removeCount={() => removeTraveller(u.userTypeString)}
          type="spacious"
          testID={'counterInput_' + u.userTypeString.toLowerCase()}
          color="interactive_2"
          hideSubtext={hideTravellerDescriptions}
          subtext={t(
            TicketTravellerTexts.information(u.userTypeString, ticketType),
          )}
        />
      ))}
    </Sections.Section>
  );
}
