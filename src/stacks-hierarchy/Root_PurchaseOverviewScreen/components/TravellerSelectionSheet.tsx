import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {PurchaseOverviewTexts, useTranslation} from '@atb/translations';
import {ScrollView} from 'react-native';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import {FullScreenFooter} from '@atb/components/screen-footer';
import {Button} from '@atb/components/button';
import {Confirm} from '@atb/assets/svg/mono-icons/actions';
import {MultipleTravellersSelection} from './Travellers/MultipleTravellersSelection';
import {SingleTravellerSelection} from './Travellers/SingleTravellerSelection';
import {
  UserProfileWithCount,
  useUserCountState,
} from './Travellers/use-user-count-state';

type TravellerSelectionSheetProps = {
  selectionMode: 'multiple' | 'single';
  fareProductType: string;
  selectableUserProfilesWithCountInit: UserProfileWithCount[];
  close: (chosenSelectableUserProfiles?: UserProfileWithCount[]) => void;
};
export const TravellerSelectionSheet = ({
  selectionMode,
  fareProductType,
  selectableUserProfilesWithCountInit,
  close,
}: TravellerSelectionSheetProps) => {
  const {t} = useTranslation();
  const style = useStyle();

  const userCountState = useUserCountState(selectableUserProfilesWithCountInit);
  const selectableUserProfilesWithCount =
    userCountState.userProfilesWithCount.filter((a) =>
      selectableUserProfilesWithCountInit.some((b) => a.id === b.id),
    );

  return (
    <BottomSheetContainer maxHeightValue={0.9}>
      <ScreenHeaderWithoutNavigation
        title={t(PurchaseOverviewTexts.travellerSelectionSheet.title)}
        color="background_1"
        leftButton={{
          text: t(PurchaseOverviewTexts.travellerSelectionSheet.close),
          type: 'cancel',
          onPress: () => close(),
        }}
      />
      <ScrollView style={style.container}>
        {selectionMode === 'multiple' ? (
          <MultipleTravellersSelection
            fareProductType={fareProductType}
            {...userCountState}
            userProfilesWithCount={selectableUserProfilesWithCount}
          />
        ) : (
          <SingleTravellerSelection
            fareProductType={fareProductType}
            {...userCountState}
            userProfilesWithCount={selectableUserProfilesWithCount}
          />
        )}
      </ScrollView>
      <FullScreenFooter>
        <Button
          text={t(PurchaseOverviewTexts.travellerSelectionSheet.confirm)}
          onPress={() => close(selectableUserProfilesWithCount)}
          rightIcon={{svg: Confirm}}
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
