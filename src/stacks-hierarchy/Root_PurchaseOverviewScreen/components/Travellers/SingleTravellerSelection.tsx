import React from 'react';
import {
  useTranslation,
  PurchaseOverviewTexts,
  getTextForLanguage,
} from '@atb/translations';
import {getReferenceDataName} from '@atb/configuration';
import {
  RadioGroupSection,
  Section,
  ToggleSectionItem,
} from '@atb/components/sections';
import {UserProfileWithCount} from '@atb/fare-contracts';
import {View} from 'react-native';
import {StyleSheet, useTheme} from '@atb/theme';
import {HoldingHands} from '@atb/assets/svg/color/images';
import {TravellerSelectionBottomSheetType} from './types';
import {useAuthState} from '@atb/auth';
import {useFeatureToggles} from '@atb/feature-toggles';

export function SingleTravellerSelection({
  userProfilesWithCount,
  addCount,
  removeCount,
  fareProductTypeConfig,
  setIsTravelerOnBehalfOfToggle,
  isTravelerOnBehalfOfToggle,
}: TravellerSelectionBottomSheetType) {
  const {t, language} = useTranslation();
  const {theme} = useTheme();
  const styles = useStyles();
  const {authenticationType} = useAuthState();
  const selectedProfile = userProfilesWithCount.find((u) => u.count);
  const isOnBehalfOfEnabled =
    useFeatureToggles().isOnBehalfOfEnabled &&
    fareProductTypeConfig.configuration.onBehalfOfEnabled;

  const isLoggedIn = authenticationType === 'phone';

  const isOnBehalfOfAllowed = isOnBehalfOfEnabled && isLoggedIn;

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
          getTextForLanguage(u.alternativeDescriptions, language)
        }
        selected={selectedProfile}
        onSelect={select}
        color={theme.color.interactive[2]}
        accessibilityHint={t(PurchaseOverviewTexts.travellerSelection.a11yHint)}
      />
      {isOnBehalfOfAllowed && (
        <Section style={styles.onBehalfOfContainer}>
          <ToggleSectionItem
            leftImage={<HoldingHands />}
            text={t(PurchaseOverviewTexts.onBehalfOf.sectionTitle)}
            subtext={t(PurchaseOverviewTexts.onBehalfOf.sectionSubText)}
            value={isTravelerOnBehalfOfToggle}
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

const useStyles = StyleSheet.createThemeHook((theme) => {
  return {
    onBehalfOfContainer: {
      marginTop: theme.spacing.medium,
    },
  };
});
