import React, {useEffect} from 'react';
import ThemeText from '@atb/components/text';
import {StyleProp, View, ViewStyle} from 'react-native';
import {StyleSheet} from '@atb/theme';
import useUserCountState, {
  UserProfileWithCount,
} from '../../Travellers/use-user-count-state';
import {PreassignedFareProduct} from '@atb/reference-data/types';
import SingleTravellerSelection from '../../Travellers/SingleTravellerSelection';
import {getPurchaseFlow} from '../../utils';
import MultipleTravellersSelection from '../../Travellers/MultipleTravellersSelection';
import {PurchaseOverviewTexts, useTranslation} from '@atb/translations';

type TravellerSelectionProps = {
  userProfilesWithCount: UserProfileWithCount[];
  setTravellerSelection: (
    userProfilesWithCount: UserProfileWithCount[],
  ) => void;
  style?: StyleProp<ViewStyle>;
  preassignedFareProduct: PreassignedFareProduct;
};

export default function TravellerSelection({
  setTravellerSelection,
  style,
  userProfilesWithCount,
  preassignedFareProduct,
}: TravellerSelectionProps) {
  const styles = useStyles();
  const {t} = useTranslation();
  const {travellerSelectionMode} = getPurchaseFlow(preassignedFareProduct);
  const userCountState = useUserCountState(userProfilesWithCount);

  useEffect(() => {
    setTravellerSelection(userCountState.userProfilesWithCount);
  }, [userCountState.userProfilesWithCount]);

  return (
    <View style={style}>
      <ThemeText type="body__secondary" color="secondary" style={styles.title}>
        {t(PurchaseOverviewTexts.travellerSelection.title)}
      </ThemeText>
      {travellerSelectionMode === 'multiple' ? (
        <MultipleTravellersSelection {...userCountState} />
      ) : (
        <SingleTravellerSelection {...userCountState} />
      )}
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  title: {
    marginBottom: theme.spacings.medium,
  },
}));
