import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {PurchaseOverviewTexts, useTranslation} from '@atb/translations';
import {
  FareProductTypeConfig,
  TravellerSelectionMode,
} from '@atb/configuration';
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

type TravellerSelectionSheetProps = {
  selectionMode: TravellerSelectionMode;
  fareProductTypeConfig: FareProductTypeConfig;
  selectableUserProfilesWithCountInit: UserProfileWithCount[];
  onConfirmSelection: (
    chosenSelectableUserProfiles: UserProfileWithCount[],
    onBehalfOfToggle: boolean,
  ) => void;
  isOnBehalfOfToggle: boolean;
};
export const TravellerSelectionSheet = ({
  selectionMode,
  fareProductTypeConfig,
  selectableUserProfilesWithCountInit,
  onConfirmSelection,
  isOnBehalfOfToggle,
}: TravellerSelectionSheetProps) => {
  const {t} = useTranslation();
  const style = useStyle();

  const userCountState = useUserCountState(selectableUserProfilesWithCountInit);
  const [isTravelerOnBehalfOfToggle, setIsTravelerOnBehalfOfToggle] =
    useState<boolean>(isOnBehalfOfToggle);
  const selectableUserProfilesWithCount =
    userCountState.userProfilesWithCount.filter((a) =>
      selectableUserProfilesWithCountInit.some((b) => a.id === b.id),
    );
  const totalTravellersCount = selectableUserProfilesWithCount.reduce(
    (acc, {count}) => acc + count,
    0,
  );

  return (
    <BottomSheetContainer
      title={t(PurchaseOverviewTexts.travellerSelectionSheet.title)}
      //maxHeightValue={0.9}
    >
      <ScrollView style={style.container}>
        {selectionMode === 'multiple' ? (
          <MultipleTravellersSelection
            fareProductTypeConfig={fareProductTypeConfig}
            {...userCountState}
            userProfilesWithCount={selectableUserProfilesWithCount}
            setIsTravelerOnBehalfOfToggle={setIsTravelerOnBehalfOfToggle}
            isTravelerOnBehalfOfToggle={isTravelerOnBehalfOfToggle}
          />
        ) : (
          <SingleTravellerSelection
            fareProductTypeConfig={fareProductTypeConfig}
            {...userCountState}
            userProfilesWithCount={selectableUserProfilesWithCount}
            setIsTravelerOnBehalfOfToggle={setIsTravelerOnBehalfOfToggle}
            isTravelerOnBehalfOfToggle={isTravelerOnBehalfOfToggle}
          />
        )}
      </ScrollView>
      <FullScreenFooter>
        <Button
          text={t(PurchaseOverviewTexts.travellerSelectionSheet.confirm)}
          disabled={totalTravellersCount < 1}
          onPress={() =>
            onConfirmSelection(
              selectableUserProfilesWithCount,
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

const useStyle = StyleSheet.createThemeHook((theme) => {
  return {
    container: {
      marginHorizontal: theme.spacings.medium,
      marginBottom: theme.spacings.medium,
    },
  };
});
