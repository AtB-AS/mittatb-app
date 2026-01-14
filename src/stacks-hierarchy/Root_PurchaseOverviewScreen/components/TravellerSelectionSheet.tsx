import {PurchaseOverviewTexts, useTranslation} from '@atb/translations';
import {View} from 'react-native';
import React, {useCallback, useState} from 'react';
import {
  type PurchaseSelectionType,
  usePurchaseSelectionBuilder,
} from '@atb/modules/purchase-selection';
import {giveFocus} from '@atb/utils/use-focus-on-load';
import {
  BottomSheetHeaderType,
  BottomSheetModal,
} from '@atb/components/bottom-sheet';
import {BottomSheetModal as GorhomBottomSheetModal} from '@gorhom/bottom-sheet';
import {TravellerSelectionSheetContent} from './TravellerSelectionSheetContent';
import {UniqueWithCount} from '@atb/utils/unique-with-count';
import {BaggageProduct, UserProfile} from '@atb-as/config-specs';

type TravellerSelectionSheetProps = {
  selection: PurchaseSelectionType;
  onSave: (selection: PurchaseSelectionType) => void;
  bottomSheetModalRef: React.RefObject<GorhomBottomSheetModal | null>;
  onCloseFocusRef: React.RefObject<View | null>;
};
export const TravellerSelectionSheet = ({
  selection,
  onSave,
  bottomSheetModalRef,
  onCloseFocusRef,
}: TravellerSelectionSheetProps) => {
  const {t} = useTranslation();
  const [showWarning, setShowWarning] = useState(false);
  const [currentSelection, setCurrentSelection] = useState<
    | {
        userProfiles: UniqueWithCount<UserProfile>[];
        baggageProducts: UniqueWithCount<BaggageProduct>[];
      }
    | undefined
  >(undefined);
  const selectionBuilder = usePurchaseSelectionBuilder();

  const updateCurrentSelection = useCallback(
    (
      userProfiles: UniqueWithCount<UserProfile>[],
      baggageProducts: UniqueWithCount<BaggageProduct>[],
    ) => {
      setCurrentSelection({
        userProfiles,
        baggageProducts,
      });
    },
    [setCurrentSelection],
  );

  const saveSelection = () => {
    let builder = selectionBuilder.fromSelection(selection);

    if (currentSelection?.userProfiles)
      builder.userProfiles(currentSelection.userProfiles);

    if (currentSelection?.baggageProducts)
      builder.baggageProducts(currentSelection.baggageProducts);

    const newSelection = builder.build();
    onSave(newSelection);
  };

  const nothingSelected =
    !!currentSelection?.userProfiles.every((u) => !u.count) &&
    !!currentSelection?.baggageProducts.every((sp) => !sp.count);

  return (
    <BottomSheetModal
      bottomSheetModalRef={bottomSheetModalRef}
      heading={t(PurchaseOverviewTexts.travellerSelectionSheet.title)}
      bottomSheetHeaderType={BottomSheetHeaderType.Confirm}
      closeOnBackdropPress={!nothingSelected}
      enablePanDownToClose={!nothingSelected}
      overrideCloseFunction={
        nothingSelected ? () => setShowWarning(true) : undefined
      }
      closeCallback={() => {
        giveFocus(onCloseFocusRef);
        saveSelection();
        setCurrentSelection(undefined);
      }}
    >
      <TravellerSelectionSheetContent
        selection={selection}
        updateCurrentSelection={updateCurrentSelection}
        showNothingSelectedWarning={nothingSelected && showWarning}
      />
    </BottomSheetModal>
  );
};
