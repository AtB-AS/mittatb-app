import React, {useEffect} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {StyleSheet} from '@atb/theme';
import useUserCountState, {
  UserProfileWithCount,
} from '../../Travellers/use-user-count-state';
import {PreassignedFareProduct} from '@atb/reference-data/types';
import SingleTravellerSelection from '../../Travellers/SingleTravellerSelection';
import MultipleTravellersSelection from '../../Travellers/MultipleTravellersSelection';
import {PurchaseOverviewTexts, useTranslation} from '@atb/translations';
import useFontScale from '@atb/utils/use-font-scale';
import InfoToggle from './InfoToggle';

type TravellerSelectionProps = {
  selectableUserProfiles: UserProfileWithCount[];
  setTravellerSelection: (
    userProfilesWithCount: UserProfileWithCount[],
  ) => void;
  style?: StyleProp<ViewStyle>;
  preassignedFareProduct: PreassignedFareProduct;
};

export default function TravellerSelection({
  setTravellerSelection,
  style,
  selectableUserProfiles,
  preassignedFareProduct,
}: TravellerSelectionProps) {
  const {t} = useTranslation();
  const {travellerSelectionMode} = preassignedFareProduct.configurations;
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
  }, [userCountState.userProfilesWithCount, preassignedFareProduct]);

  useEffect(() => {
    userCountState.updateSelectable(selectableUserProfiles);
  }, [selectableUserProfiles]);

  return (
    <View style={style}>
      <InfoToggle
        title={
          travellerSelectionMode == 'multiple'
            ? t(PurchaseOverviewTexts.travellerSelection.title_multiple)
            : t(PurchaseOverviewTexts.travellerSelection.title_single)
        }
      />
      {travellerSelectionMode === 'multiple' ? (
        <MultipleTravellersSelection
          fareProductType={preassignedFareProduct.type}
          {...userCountState}
          userProfilesWithCount={selectableUserProfilesWithCount}
        />
      ) : (
        <SingleTravellerSelection
          fareProductType={preassignedFareProduct.type}
          {...userCountState}
          userProfilesWithCount={selectableUserProfilesWithCount}
        />
      )}
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => {
  const scale = useFontScale();
  return {
    title: {
      marginBottom: theme.spacings.medium,
    },
    toggle: {
      alignSelf: 'center',
    },
    androidToggle: {
      transform: [{scale: scale}, {translateY: -6}],
    },
    iosToggle: {
      marginLeft: theme.spacings.xSmall,
      transform: [{scale: 0.7 * scale}, {translateY: -10}],
    },
  };
});
