import React, {useEffect} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {
  useUserCountState,
  UserProfileWithCount,
} from './Travellers/use-user-count-state';
import {SingleTravellerSelection} from './Travellers/SingleTravellerSelection';
import {MultipleTravellersSelection} from './Travellers/MultipleTravellersSelection';
import {InfoToggle} from './InfoToggle';
import {PurchaseOverviewTexts, useTranslation} from '@atb/translations';
import {TravellerSelectionMode} from '@atb/configuration';

type TravellerSelectionProps = {
  selectableUserProfiles: UserProfileWithCount[];
  setTravellerSelection: (
    userProfilesWithCount: UserProfileWithCount[],
  ) => void;
  style?: StyleProp<ViewStyle>;
  selectionMode: TravellerSelectionMode;
  fareProductType: string;
};

export function TravellerSelection({
  setTravellerSelection,
  style,
  selectableUserProfiles,
  selectionMode,
  fareProductType,
}: TravellerSelectionProps) {
  const {t} = useTranslation();

  const userCountState = useUserCountState(selectableUserProfiles);
  const selectableUserProfilesWithCount =
    userCountState.userProfilesWithCount.filter((a) =>
      selectableUserProfiles.some((b) => a.id === b.id),
    );
  useEffect(() => {
    const filteredSelection = userCountState.userProfilesWithCount.filter((u) =>
      selectableUserProfiles.find((i) => i.id === u.id),
    );
    setTravellerSelection(filteredSelection);
  }, [userCountState.userProfilesWithCount, fareProductType, selectionMode]);

  useEffect(() => {
    userCountState.updateSelectable(selectableUserProfiles);
  }, [selectableUserProfiles]);

  useEffect(() => {
    if (selectionMode === 'none') {
      if (userCountState.userProfilesWithCount.length) {
        const selectedProfile = userCountState.userProfilesWithCount.find(
          (u) => u.count,
        );
        if (selectedProfile) {
          userCountState.removeCount(selectedProfile.userTypeString);
        }
      }
      userCountState.addCount(selectableUserProfiles[0].userTypeString);
    }
  }, [selectionMode, selectableUserProfiles]);

  if (selectionMode === 'none') {
    return <></>;
  }

  return (
    <View style={style}>
      <InfoToggle
        title={
          selectionMode == 'multiple'
            ? t(PurchaseOverviewTexts.travellerSelection.title_multiple)
            : t(PurchaseOverviewTexts.travellerSelection.title_single)
        }
        accessibilityLabel={t(
          PurchaseOverviewTexts.infoToggle.travellerA11yLabel,
        )}
      />
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
    </View>
  );
}
