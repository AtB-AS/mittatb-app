import {
  dictionary,
  PurchaseOverviewTexts,
  useTranslation,
} from '@atb/translations';
import {View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {StyleSheet} from '@atb/theme';
import {Confirm} from '@atb/assets/svg/mono-icons/actions';
import {MultipleTravellersSelection} from './Travellers/MultipleTravellersSelection';
import {SingleTravellerSelection} from './Travellers/SingleTravellerSelection';
import {useUserCountState} from './Travellers/use-user-count-state';
import {useBaggageCountState} from './Travellers/use-baggage-count-state';
import {
  type PurchaseSelectionType,
  usePurchaseSelectionBuilder,
} from '@atb/modules/purchase-selection';
import {giveFocus} from '@atb/utils/use-focus-on-load';
import {BottomSheetModal} from '@atb/components/bottom-sheet-v2';
import {BottomSheetModal as GorhomBottomSheetModal} from '@gorhom/bottom-sheet';
import {MessageSectionItem, Section} from '@atb/components/sections';

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
  const styles = useStyles();
  const selectionBuilder = usePurchaseSelectionBuilder();
  const [showWarning, setShowWarning] = useState(false);

  const selectionMode =
    selection.fareProductTypeConfig.configuration.travellerSelectionMode;

  const userCountState = useUserCountState(selection);
  const baggageCountState = useBaggageCountState(selection);

  const nothingSelected =
    userCountState.state.every((u) => !u.count) &&
    baggageCountState.state.every((sp) => !sp.count);

  useEffect(() => {
    if (!nothingSelected) {
      setShowWarning(false);
    }
  }, [nothingSelected]);

  const saveSelection = () => {
    const newSelection = selectionBuilder
      .fromSelection(selection)
      .userProfiles(userCountState.state)
      .baggageProducts(baggageCountState.state)
      .build();
    onSave(newSelection);
  };

  return (
    <BottomSheetModal
      bottomSheetModalRef={bottomSheetModalRef}
      heading={t(PurchaseOverviewTexts.travellerSelectionSheet.title)}
      rightIconText={t(dictionary.confirm)}
      closeOnBackdropPress={!nothingSelected}
      enablePanDownToClose={!nothingSelected}
      overrideCloseFunction={
        nothingSelected ? () => setShowWarning(true) : undefined
      }
      rightIcon={Confirm}
      closeCallback={() => {
        giveFocus(onCloseFocusRef);
        saveSelection();
      }}
    >
      <View style={styles.container}>
        {!!nothingSelected && showWarning && (
          <Section style={styles.messageContainer}>
            <MessageSectionItem
              message={t(PurchaseOverviewTexts.selectAtLeastOneTraveller)}
              messageType="error"
            />
          </Section>
        )}
        {selectionMode === 'multiple' ? (
          <MultipleTravellersSelection
            userCountState={userCountState}
            baggageCountState={baggageCountState}
          />
        ) : (
          <SingleTravellerSelection {...userCountState} />
        )}
      </View>
    </BottomSheetModal>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  return {
    container: {
      marginHorizontal: theme.spacing.medium,
    },
    messageContainer: {
      marginBottom: theme.spacing.medium,
    },
  };
});
