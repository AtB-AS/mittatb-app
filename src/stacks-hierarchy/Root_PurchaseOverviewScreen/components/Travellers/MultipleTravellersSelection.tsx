import React, {useRef} from 'react';
import {
  getTextForLanguage,
  Language,
  PurchaseOverviewTexts,
  TicketTravellerTexts,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import {getReferenceDataName} from '@atb/configuration';
import {useScreenReaderAnnouncement} from '@atb/components/screen-reader-announcement';
import {
  CounterSectionItem,
  Section,
  ToggleSectionItem,
} from '@atb/components/sections';
import {UserProfileWithCount} from '@atb/fare-contracts';
import {useOnBehalfOfEnabled} from '@atb/on-behalf-of';
import {HoldingHands} from '@atb/assets/svg/color/images';
import {View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {TravellerSelectionBottomSheetType} from './types';

export function MultipleTravellersSelection({
  userProfilesWithCount,
  addCount,
  removeCount,
  fareProductTypeConfig,
  setIsTravelerOnBehalfOfToggle,
  isTravelerOnBehalfOfToggle,
}: TravellerSelectionBottomSheetType) {
  const {t, language} = useTranslation();
  const styles = useStyles();

  const travellersModified = useRef(false);

  const isOnBehalfOfEnabled =
    useOnBehalfOfEnabled() &&
    fareProductTypeConfig.configuration.onBehalfOfEnabled;

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
    <View>
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
            subtext={[
              getTextForLanguage(u.alternativeDescriptions, language),
              t(
                TicketTravellerTexts.information(
                  u.userTypeString,
                  fareProductTypeConfig.type,
                ),
              ),
            ].join(' ')}
          />
        ))}
      </Section>
      {isOnBehalfOfEnabled && (
        <Section style={styles.onBehalfOfContainer}>
          <ToggleSectionItem
            leftImage={<HoldingHands />}
            text={t(PurchaseOverviewTexts.onBehalfOf.sectionTitle)}
            subtext={t(PurchaseOverviewTexts.onBehalfOf.sectionSubText)}
            value={isTravelerOnBehalfOfToggle}
            label="new"
            textType="body__primary--bold"
            onValueChange={(checked) => {
              setIsTravelerOnBehalfOfToggle(checked);
            }}
            testID="onBehalfOfToggle"
          />
        </Section>
      )}
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

const useStyles = StyleSheet.createThemeHook((theme) => {
  return {
    onBehalfOfContainer: {
      marginTop: theme.spacings.medium,
    },
  };
});
