import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {PurchaseOverviewTexts, useTranslation} from '@atb/translations';
import {ScrollView} from 'react-native';
import React, {useState} from 'react';
import {StyleSheet} from '@atb/theme';
import {FullScreenFooter} from '@atb/components/screen-footer';
import {Button} from '@atb/components/button';
import {Confirm} from '@atb/assets/svg/mono-icons/actions';
import {MultipleTravellersSelection} from './Travellers/MultipleTravellersSelection';
import {SingleTravellerSelection} from './Travellers/SingleTravellerSelection';
import {useUserCountState} from './Travellers/use-user-count-state';
import {UserProfileWithCount} from '@atb/fare-contracts';
import type {PurchaseSelectionType} from '@atb/purchase-selection';
import {Section, ToggleSectionItem} from '@atb/components/sections';
import {HoldingHands} from '@atb/assets/svg/color/images';
import {useFeatureToggles} from '@atb/feature-toggles';
import {useAuthState} from '@atb/auth';

type TravellerSelectionSheetProps = {
  selection: PurchaseSelectionType;
  isOnBehalfOfToggle: boolean;
  onSave: (
    chosenSelectableUserProfiles: UserProfileWithCount[],
    onBehalfOfToggle: boolean,
  ) => void;
};
export const TravellerSelectionSheet = ({
  selection,
  isOnBehalfOfToggle,
  onSave,
}: TravellerSelectionSheetProps) => {
  const {t} = useTranslation();
  const styles = useStyles();

  const selectionMode =
    selection.fareProductTypeConfig.configuration.travellerSelectionMode;

  const userCountState = useUserCountState(selection);
  const [isTravelerOnBehalfOfToggle, setIsTravelerOnBehalfOfToggle] =
    useState<boolean>(isOnBehalfOfToggle);

  const noProfilesSelected = userCountState.userProfilesWithCount.every(
    (u) => !u.count,
  );

  const shouldShowOnBehalfOf = useShouldShowOnBehalfOf(selection);

  return (
    <BottomSheetContainer
      title={t(PurchaseOverviewTexts.travellerSelectionSheet.title)}
      maxHeightValue={0.9}
    >
      <ScrollView style={styles.container}>
        {selectionMode === 'multiple' ? (
          <MultipleTravellersSelection {...userCountState} />
        ) : (
          <SingleTravellerSelection {...userCountState} />
        )}
        {shouldShowOnBehalfOf && (
          <Section style={styles.onBehalfOfContainer}>
            <ToggleSectionItem
              leftImage={<HoldingHands />}
              text={t(PurchaseOverviewTexts.onBehalfOf.sectionTitle)}
              subtext={t(PurchaseOverviewTexts.onBehalfOf.sectionSubText)}
              value={isTravelerOnBehalfOfToggle}
              textType="body__primary--bold"
              onValueChange={setIsTravelerOnBehalfOfToggle}
              testID="onBehalfOfToggle"
            />
          </Section>
        )}
      </ScrollView>
      <FullScreenFooter>
        <Button
          text={t(PurchaseOverviewTexts.travellerSelectionSheet.confirm)}
          disabled={noProfilesSelected}
          onPress={() =>
            onSave(
              userCountState.userProfilesWithCount,
              isTravelerOnBehalfOfToggle,
            )
          }
          rightIcon={{svg: Confirm}}
          testID="confirmButton"
        />
      </FullScreenFooter>
    </BottomSheetContainer>
  );
};

const useShouldShowOnBehalfOf = (selection: PurchaseSelectionType) => {
  const isOnBehalfOfEnabled =
    useFeatureToggles().isOnBehalfOfEnabled &&
    selection.fareProductTypeConfig.configuration.onBehalfOfEnabled;
  const isLoggedIn = useAuthState().authenticationType === 'phone';
  return isOnBehalfOfEnabled && isLoggedIn;
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  return {
    container: {
      marginHorizontal: theme.spacing.medium,
      marginBottom: theme.spacing.medium,
    },
    onBehalfOfContainer: {
      marginTop: theme.spacing.medium,
    },
  };
});
