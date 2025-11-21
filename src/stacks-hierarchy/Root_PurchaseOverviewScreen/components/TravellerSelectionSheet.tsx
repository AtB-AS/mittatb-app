import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {PurchaseOverviewTexts, useTranslation} from '@atb/translations';
import {ScrollView} from 'react-native';
import React from 'react';
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
import {useBaggageCountProductState} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/components/Travellers/use-baggage-product-count-state';

type TravellerSelectionSheetProps = {
  selection: PurchaseSelectionType;
  onSave: (selection: PurchaseSelectionType) => void;
};
export const TravellerSelectionSheet = ({
  selection,
  onSave,
}: TravellerSelectionSheetProps) => {
  const {t} = useTranslation();
  const styles = useStyles();
  const selectionBuilder = usePurchaseSelectionBuilder();

  const selectionMode =
    selection.fareProductTypeConfig.configuration.travellerSelectionMode;

  const userCountState = useUserCountState(selection);
  const baggageProductCountState = useBaggageCountProductState(selection);

  const nothingSelected =
    userCountState.userProfilesWithCount.every((u) => !u.count) &&
    baggageProductCountState.baggageProductsWithCount.every((sp) => !sp.count);

  return (
    <BottomSheetContainer
      title={t(PurchaseOverviewTexts.travellerSelectionSheet.title)}
      maxHeightValue={0.9}
    >
      <ScrollView style={styles.container}>
        {selectionMode === 'multiple' ? (
          <MultipleTravellersSelection
            userCountState={userCountState}
            baggageProductCountState={baggageProductCountState}
          />
        ) : (
          <SingleTravellerSelection {...userCountState} />
        )}
      </ScrollView>
      <FullScreenFooter>
        <Button
          expanded={true}
          text={t(PurchaseOverviewTexts.travellerSelectionSheet.confirm)}
          disabled={nothingSelected}
          onPress={() => {
            const newSelection = selectionBuilder
              .fromSelection(selection)
              .baggageProducts(
                baggageProductCountState.baggageProductsWithCount,
              )
              .userProfiles(userCountState.userProfilesWithCount)
              .build();
            onSave(newSelection);
          }}
          rightIcon={{svg: Confirm}}
          testID="confirmButton"
        />
      </FullScreenFooter>
    </BottomSheetContainer>
  );
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
