import React, {useRef} from 'react';
import {
  getTextForLanguage,
  Language,
  PurchaseOverviewTexts,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import {
  BaggageProduct,
  getReferenceDataName,
  UserProfile,
} from '@atb/modules/configuration';
import {useScreenReaderAnnouncement} from '@atb/components/screen-reader-announcement';
import {CounterSectionItem, Section} from '@atb/components/sections';
import {useThemeContext} from '@atb/theme';
import type {
  BaggageProductWithCount,
  UserProfileWithCount,
} from '@atb/modules/fare-contracts';
import {View} from 'react-native';
import {UniqueCountState} from '@atb/utils/unique-with-count';
import type {PreassignedFareProduct} from '@atb-as/config-specs';
import {useAuthContext} from '@atb/modules/auth';
import {MessageId} from '../message';

type Props = {
  product: PreassignedFareProduct;
  userCountState: UniqueCountState<UserProfile>;
  baggageCountState: UniqueCountState<BaggageProduct>;
  setInfoMessage: (messageId?: MessageId) => void;
};

export function MultipleTravellersSelection(props: Props) {
  const {t, language} = useTranslation();
  const {theme} = useThemeContext();
  const {isLoggedIn} = useAuthContext();

  const travellersModified = useRef(false);

  const onIncrementTraveller = (userProfile: UserProfileWithCount) => {
    if (!props.userCountState.canIncrement(userProfile)) {
      props.setInfoMessage(
        isLoggedIn ? MessageId.limitReached : MessageId.loginRequired,
      );
      return;
    }
    travellersModified.current = true;
    props.userCountState.increment(userProfile);
  };

  const onDecrementTraveller = (userProfile: UserProfileWithCount) => {
    if (!props.userCountState.canDecrement(userProfile)) return;
    if (userProfile.count === userProfile.limit) {
      props.setInfoMessage(undefined);
    }
    travellersModified.current = true;
    props.userCountState.decrement(userProfile);
  };

  const onIncrementBaggage = (baggageProduct: BaggageProductWithCount) => {
    travellersModified.current = true;
    props.baggageCountState.increment(baggageProduct);
  };

  const onDecrementBaggage = (baggageProduct: BaggageProductWithCount) => {
    travellersModified.current = true;
    props.baggageCountState.decrement(baggageProduct);
  };

  useScreenReaderAnnouncement(
    createTravellersText(props.userCountState.state, false, true, t, language),
    travellersModified.current,
  );

  return (
    <View style={{rowGap: theme.spacing.medium}}>
      <Section>
        {props.userCountState.state.map((u) => (
          <CounterSectionItem
            key={u.userTypeString}
            text={getReferenceDataName(u, language)}
            count={u.count}
            addCount={() => onIncrementTraveller(u)}
            removeCount={() => onDecrementTraveller(u)}
            testID={'counterInput_' + u.userTypeString.toLowerCase()}
            color={theme.color.interactive[2]}
            subtext={getTextForLanguage(u.alternativeDescriptions, language)}
          />
        ))}
      </Section>
      <Section>
        {props.baggageCountState.state.map((s) => (
          <CounterSectionItem
            key={s.id}
            text={getReferenceDataName(s, language)}
            count={s.count}
            addCount={() => onIncrementBaggage(s)}
            removeCount={() => onDecrementBaggage(s)}
            color={theme.color.interactive[2]}
            subtext={getTextForLanguage(s.description, language)}
            baggageType={s.baggageType}
          />
        ))}
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
