import React, {useRef} from 'react';
import {UserCountState, UserProfileWithCount} from './use-user-count-state';
import {
  useTranslation,
  TicketTravellerTexts,
  PurchaseOverviewTexts,
  TranslateFunction,
  Language,
  getTextForLanguage,
} from '@atb/translations';
import {getReferenceDataName} from '@atb/reference-data/utils';
import {useScreenReaderAnnouncement} from '@atb/components/screen-reader-announcement';
import {usePreferences} from '@atb/preferences';
import {CounterSectionItem, Section} from '@atb/components/sections';

export function MultipleTravellersSelection({
  userProfilesWithCount,
  addCount,
  removeCount,
  fareProductType,
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
    <Section>
      {userProfilesWithCount.map((u) => (
        <CounterSectionItem
          key={u.userTypeString}
          text={getReferenceDataName(u, language)}
          count={u.count}
          addCount={() => addTraveller(u.userTypeString)}
          removeCount={() => removeTraveller(u.userTypeString)}
          type="spacious"
          testID={'counterInput_' + u.userTypeString.toLowerCase()}
          color="interactive_2"
          hideSubtext={hideTravellerDescriptions}
          subtext={[
            getTextForLanguage(u.alternativeDescriptions, language),
            t(
              TicketTravellerTexts.information(
                u.userTypeString,
                fareProductType,
              ),
            ),
          ].join(' ')}
        />
      ))}
    </Section>
  );
}

function createTravellersText(
  userProfilesWithCount: UserProfileWithCount[],
  /**
   * shortened Shorten text if more than two traveller groups, making
   * '2 adults, 1 child, 2 senior' become '5 travellers'.
   */
  shortened: boolean,
  /**
   * prefixed Prefix the traveller selection with text signalling it is the current
   * selection.
   */
  prefixed: boolean,
  t: TranslateFunction,
  language: Language,
) {
  const chosenUserProfiles = userProfilesWithCount.filter((u) => u.count);

  const prefix = prefixed ? t(PurchaseOverviewTexts.travellers.prefix) : '';

  if (chosenUserProfiles.length === 0) {
    return prefix + t(PurchaseOverviewTexts.travellers.noTravellers);
  } else if (chosenUserProfiles.length > 2 && shortened) {
    const totalCount = chosenUserProfiles.reduce(
      (total, u) => total + u.count,
      0,
    );
    return (
      prefix + t(PurchaseOverviewTexts.travellers.travellersCount(totalCount))
    );
  } else {
    return (
      prefix +
      chosenUserProfiles
        .map((u) => `${u.count} ${getReferenceDataName(u, language)}`)
        .join(', ')
    );
  }
}
