import React from 'react';
import {UserCountState} from './use-user-count-state';
import {useTranslation, PurchaseOverviewTexts} from '@atb/translations';
import {getReferenceDataName} from '@atb/configuration';
import {
  RadioGroupSection,
  Section,
  ToggleSectionItem,
} from '@atb/components/sections';
import {UserProfileWithCount} from '@atb/fare-contracts';
import {View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {HoldingHands} from '@atb/assets/svg/color/images';
import {useOnBehalfOf} from '@atb/on-behalf-of';
import {TravelerOnBehalfOfProps} from './types';
import {getTravellerInfoByFareProductType} from './../../utils';

export function SingleTravellerSelection({
  userProfilesWithCount,
  addCount,
  removeCount,
  fareProductType,
  setIsTravelerOnBehalfOfToggle,
  isTravelerOnBehalfOfToggle,
}: UserCountState & TravelerOnBehalfOfProps) {
  const {t, language} = useTranslation();
  const styles = useStyles();
  const selectedProfile = userProfilesWithCount.find((u) => u.count);
  const isOnBehalfOfEnabled = useOnBehalfOf();

  const select = (u: UserProfileWithCount) => {
    if (selectedProfile) {
      removeCount(selectedProfile.userTypeString);
    }
    addCount(u.userTypeString);
  };

  return (
    <View>
      <RadioGroupSection<UserProfileWithCount>
        items={userProfilesWithCount}
        keyExtractor={(u) => u.userTypeString}
        itemToText={(u) => getReferenceDataName(u, language)}
        itemToSubtext={(u) =>
          getTravellerInfoByFareProductType(fareProductType, u, language, t)
        }
        selected={selectedProfile}
        onSelect={select}
        color="interactive_2"
        accessibilityHint={t(PurchaseOverviewTexts.travellerSelection.a11yHint)}
      />
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
          />
        </Section>
      )}
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => {
  return {
    onBehalfOfContainer: {
      marginTop: theme.spacings.medium,
    },
  };
});
