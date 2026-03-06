import React, {useEffect, useRef, useState} from 'react';
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
import {MessageInfoBox} from '@atb/components/message-info-box';
import type {PreassignedFareProduct} from '@atb-as/config-specs';

type Props = {
  product: PreassignedFareProduct;
  userCountState: UniqueCountState<UserProfile>;
  baggageCountState: UniqueCountState<BaggageProduct>;
};

type InfoMessageType = 'loginRequired' | 'limitReached' | undefined;

export function MultipleTravellersSelection(props: Props) {
  const {t, language} = useTranslation();
  const {theme} = useThemeContext();
  const [infoMessage, setInfoMessage] = useState<InfoMessageType>();

  const travellersModified = useRef(false);

  /**
   * In general we should try to avoid effect hooks, but this one
   * is a lot better than looking at the counts and calculating the
   * result, across userCountState and baggageCountState every time
   * we increment or decrement, which would be the alternative.
   */
  useEffect(() => {
    if (
      !props.userCountState.isAllCountsWithinLimit ||
      !props.baggageCountState.isAllCountsWithinLimit
    ) {
      setInfoMessage('limitReached');
    } else {
      setInfoMessage(undefined);
    }
  }, [
    props.baggageCountState.isAllCountsWithinLimit,
    props.userCountState.isAllCountsWithinLimit,
  ]);

  const onIncrementTraveller = (userProfile: UserProfileWithCount) => {
    travellersModified.current = true;
    props.userCountState.increment(userProfile);
  };

  const onDecrementTraveller = (userProfile: UserProfileWithCount) => {
    travellersModified.current = true;
    props.userCountState.decrement(userProfile);
  };

  const onIncrementBaggage = (baggageProduct: BaggageProductWithCount) => {
    if (baggageProduct.limit && baggageProduct.count >= baggageProduct.limit) {
      setInfoMessage('limitReached');
      return;
    }
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
      {infoMessage === 'limitReached' && (
        <MessageInfoBox
          type="info"
          title="Du må være innlogget"
          message="Logg inn for å velge gratis reisende"
          onPressConfig={{
            text: 'Logg inn',
            action: () => {},
          }}
        />
      )}
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
