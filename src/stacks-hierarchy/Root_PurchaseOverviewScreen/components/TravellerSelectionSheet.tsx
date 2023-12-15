import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {PurchaseOverviewTexts, useTranslation} from '@atb/translations';
import {TravellerSelectionMode} from '@atb/configuration';
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
  fareProductType: string;
  selectableUserProfilesWithCountInit: UserProfileWithCount[];
  close: (
    chosenSelectableUserProfiles?: UserProfileWithCount[],
    onBehalfOfToggle?: boolean,
  ) => void;
  isOnBehalfOfToggle: boolean;
};
export const TravellerSelectionSheet = ({
  selectionMode,
  fareProductType,
  selectableUserProfilesWithCountInit,
  close,
  isOnBehalfOfToggle,
}: TravellerSelectionSheetProps) => {
  const {t} = useTranslation();
  const style = useStyle();

  const userCountState = useUserCountState(selectableUserProfilesWithCountInit);
  const [travelerOnBehalfOfToggle, setTravelerOnBehalfOfToggle] =
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
            setOnBehalfOfToggle={setTravelerOnBehalfOfToggle}
            isOnBehalfOfToggle={travelerOnBehalfOfToggle}
          />
        ) : (
          <SingleTravellerSelection
            fareProductType={fareProductType}
            {...userCountState}
            userProfilesWithCount={selectableUserProfilesWithCount}
            setOnBehalfOfToggle={setTravelerOnBehalfOfToggle}
            isOnBehalfOfToggle={travelerOnBehalfOfToggle}
          />
        )}
      </ScrollView>
      <FullScreenFooter>
        <Button
          text={t(PurchaseOverviewTexts.travellerSelectionSheet.confirm)}
          disabled={totalTravellersCount < 1}
          onPress={() =>
            close(selectableUserProfilesWithCount, travelerOnBehalfOfToggle)
          }
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
