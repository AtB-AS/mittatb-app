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
import {
  type PurchaseSelectionType,
  usePurchaseSelectionBuilder,
} from '@atb/modules/purchase-selection';
import {Section, ToggleSectionItem} from '@atb/components/sections';
import {HoldingHands} from '@atb/assets/svg/color/images';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {useAuthContext} from '@atb/auth';

type TravellerSelectionSheetProps = {
  selection: PurchaseSelectionType;
  isOnBehalfOfToggle: boolean;
  onSave: (selection: PurchaseSelectionType, onBehalfOfToggle: boolean) => void;
};
export const TravellerSelectionSheet = ({
  selection,
  isOnBehalfOfToggle,
  onSave,
}: TravellerSelectionSheetProps) => {
  const {t} = useTranslation();
  const styles = useStyles();
  const selectionBuilder = usePurchaseSelectionBuilder();

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
          expanded={true}
          text={t(PurchaseOverviewTexts.travellerSelectionSheet.confirm)}
          disabled={noProfilesSelected}
          onPress={() => {
            const newSelection = selectionBuilder
              .fromSelection(selection)
              .userProfiles(userCountState.userProfilesWithCount)
              .build();
            onSave(newSelection, isTravelerOnBehalfOfToggle);
          }}
          rightIcon={{svg: Confirm}}
          testID="confirmButton"
        />
      </FullScreenFooter>
    </BottomSheetContainer>
  );
};

const useShouldShowOnBehalfOf = (selection: PurchaseSelectionType) => {
  const isOnBehalfOfEnabled =
    useFeatureTogglesContext().isOnBehalfOfEnabled &&
    selection.fareProductTypeConfig.configuration.onBehalfOfEnabled;
  const isLoggedIn = useAuthContext().authenticationType === 'phone';
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
