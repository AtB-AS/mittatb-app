import React, {useRef} from 'react';
import {
  getTextForLanguage,
  Language,
  PurchaseOverviewTexts,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import {getReferenceDataName} from '@atb/modules/configuration';
import {useScreenReaderAnnouncement} from '@atb/components/screen-reader-announcement';
import {CounterSectionItem, Section} from '@atb/components/sections';
import {useThemeContext} from '@atb/theme';
import type {SupplementProductState, UserCountState} from './types';
import type {UserProfileWithCount} from '@atb/modules/fare-contracts';
import {View} from 'react-native';

type Props = {
  userCountState: UserCountState;
  supplementProductCountState: SupplementProductState;
};

export function MultipleTravellersSelection(props: Props) {
  const {t, language} = useTranslation();
  const {theme} = useThemeContext();

  const travellersModified = useRef(false);

  const addTraveller = (userTypeString: string) => {
    travellersModified.current = true;
    props.userCountState.increment(userTypeString);
  };

  const removeTraveller = (userTypeString: string) => {
    travellersModified.current = true;
    props.userCountState.decrement(userTypeString);
  };

  const addSupplementProduct = (supplementProductString: string) => {
    travellersModified.current = true;
    props.supplementProductCountState.increment(supplementProductString);
  };

  const removeSupplementProduct = (supplementProductString: string) => {
    travellersModified.current = true;
    props.supplementProductCountState.decrement(supplementProductString);
  };

  useScreenReaderAnnouncement(
    createTravellersText(
      props.userCountState.userProfilesWithCount,
      false,
      true,
      t,
      language,
    ),
    travellersModified.current,
  );

  return (
    <View style={{rowGap: theme.spacing.medium}}>
      <Section>
        {props.userCountState.userProfilesWithCount.map((u) => (
          <CounterSectionItem
            key={u.userTypeString}
            text={getReferenceDataName(u, language)}
            count={u.count}
            addCount={() => addTraveller(u.userTypeString)}
            removeCount={() => removeTraveller(u.userTypeString)}
            testID={'counterInput_' + u.userTypeString.toLowerCase()}
            color={theme.color.interactive[2]}
            subtext={getTextForLanguage(u.alternativeDescriptions, language)}
          />
        ))}
      </Section>
      <Section>
        {props.supplementProductCountState.supplementProductsWithCount.map(
          (s) => (
            <CounterSectionItem
              key={s.id}
              text={getReferenceDataName(s, language)}
              count={s.count}
              addCount={() => addSupplementProduct(s.id)}
              removeCount={() => removeSupplementProduct(s.id)}
              subtext={getTextForLanguage(s.description, language)}
              illustrationName={s.illustration}
            />
          ),
        )}
      </Section>
    </View>
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
